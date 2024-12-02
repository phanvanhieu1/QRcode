import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { Combo, ComboDocument } from './schemas/combo.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { product, productDocument } from '../product/schemas/product.schemas';

@Injectable()
export class ComboService {
  constructor(
    @InjectModel(Combo.name) private comboModel: Model<ComboDocument>,
    @InjectModel(product.name) private productModel: Model<productDocument>,
  ) {}

  async createCombo(createComboDto: CreateComboDto): Promise<Combo> {
    const { name, description, price, items, images, discount, isAvailable } =
      createComboDto;

    // Validate và chuyển đổi items thành ComboItem
    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const { product, quantity } = item;

        if (!Types.ObjectId.isValid(product)) {
          throw new NotFoundException(`ID sản phẩm không hợp lệ: ${product}`);
        }

        const productDoc = await this.productModel.findById(product);
        if (!productDoc) {
          throw new NotFoundException(
            `Không tìm thấy sản phẩm với ID: ${product}`,
          );
        }

        return {
          product: new Types.ObjectId(product), // Chuyển đổi thành ObjectId
          quantity,
        };
      }),
    );

    // Tạo combo mới
    const newCombo = await this.comboModel.create({
      name,
      description,
      price,
      items: validatedItems, // Sử dụng items đã validate
      images,
      discount,
      isAvailable,
    });

    return newCombo;
  }

  async findAll(user: any): Promise<Combo[]> {
    const role = user.role;
    if (role === undefined) {
      throw new NotFoundException('Not find to u');
    }
    if (role === 'ADMIN' || role === 'EMPLOYEE') {
      return this.comboModel.find().populate('items').exec();
    } else if (role === 'GUEST') {
      return this.comboModel
        .find({ isAvailable: true })
        .populate('items')
        .exec();
    } else {
      throw new NotFoundException('Unauthorized role');
    }
  }

  async findOne(id: string) {
    const rs = await this.comboModel.findById(id);
    return rs;
  }

  async update(
    id: string,
    updateComboDto: UpdateComboDto,
    role: string,
  ): Promise<Combo> {
    const combo = await this.comboModel.findById(id);
    if (!combo) {
      throw new NotFoundException(`Combo with ID ${id} not found`);
    }

    switch (role) {
      case 'ADMIN':
        this.updateComboForAdmin(combo, updateComboDto);
        break;

      case 'EMPLOYEE':
        this.updateComboForEmployee(combo, updateComboDto);
        break;

      default:
        throw new ForbiddenException(
          'Bạn không có quyền thực hiện thao tác này.',
        );
    }

    return combo.save();
  }

  private updateComboForAdmin(
    combo: Combo,
    updateComboDto: UpdateComboDto,
  ): void {
    const { name, description, items, price, isAvailable, images } =
      updateComboDto;

    if (name) combo.name = name;
    if (description) combo.description = description;
    if (items) {
      combo.items = items.map((item) => ({
        product: new Types.ObjectId(item.product),
        quantity: item.quantity,
      }));
    }
    if (price) combo.price = price;
    if (isAvailable !== undefined) combo.isAvailable = isAvailable;
    if (images) combo.images = images;
  }

  private updateComboForEmployee(
    combo: Combo,
    updateComboDto: UpdateComboDto,
  ): void {
    const { isAvailable } = updateComboDto;
    const allowedFields = ['isAvailable'];
    const invalidFields = Object.keys(updateComboDto).filter(
      (field) => !allowedFields.includes(field),
    );
    if (invalidFields.length > 0) {
      throw new ForbiddenException(
        `Bạn không được phép thay đổi các trường sau: ${invalidFields.join(', ')}`,
      );
    }

    if (isAvailable !== undefined) combo.isAvailable = isAvailable;
  }

  async remove(id: string) {
    const rs = await this.comboModel.findByIdAndDelete(id);
    return rs;
  }

  async removeAll() {
    return this.comboModel.deleteMany();
  }
}
