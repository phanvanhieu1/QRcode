import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { order } from './schemas/order.schemas';
import { Model } from 'mongoose';
import { OrderStatus } from '@/decorator/enum';
import { RemoveItemsDto } from './dto/remove-item.dto';
import { google } from 'googleapis';
@Injectable()
export class OrderService {
  private sheets;
  constructor(
    @InjectModel(order.name) 
    private orderModel: Model<order>, 
  ) {
 
    this.sheets = google.sheets({
      version: 'v4', 
      auth: new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'], 
      }),
    });
  }

  async create(cartDto: CartDto, tableNum: number) {
    const items = cartDto.items.map(item => ({
      quantity: item.quantity,
      amount: item.amount,
      product: item.productId, 
    }));

    return await this.orderModel.create({
      tableNumber: tableNum,
      nameGuest: cartDto.nameGuest,
      items: items,
    });
  }

  async findAll() {
    return await this.orderModel.find().populate({
      path: 'items.product',
      model: 'product',
    })
    .exec();
  }

  async findOne(id: string) {
    return await this.orderModel.find({
      _id : id
    }).populate({
      path: 'items.product',
      model: 'product',
    }) 
    .exec();
  }

  private getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const statuses = Object.values(OrderStatus) as OrderStatus[];
    const currentIndex = statuses.indexOf(currentStatus);
    // console.log(statuses.indexOf(currentStatus))
    // console.log(currentIndex)
    if (currentStatus === OrderStatus.COMPLETED) {
      return null;
  }
    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      return null; 
    }

    return statuses[currentIndex + 1] as OrderStatus; 
  }

  async updateOrderToNextStatus(id: string): Promise<any > {
    const order = await this.orderModel.findById({
      _id : id
    })

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }

    const nextStatus = this.getNextStatus(order.status);
    if (!nextStatus) {
      throw new BadRequestException('Đơn hàng đã hoàn tất hoặc đã bị huỷ.');
    }

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      { $set: { status: nextStatus } },
      { new: true }
  );

  return updatedOrder;
  }

  async addItemToOrder(id: string, addItemsDto: any): Promise<any> {
    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
  }

  switch (order.status) {
    case OrderStatus.PLACED:
      case OrderStatus.CONFIRMED:
      case OrderStatus.COOKING:
          break;
      case OrderStatus.COMPLETED:
        throw new BadRequestException('Không thể thêm món vào đơn hàng đã hoàn tất');
      case OrderStatus.CANCELLED:
          throw new BadRequestException('Không thể thêm món vào đơn hàng đã hủy.');
      default:
          throw new BadRequestException('Trạng thái đơn hàng không hợp lệ.');
  }

  for (const item of addItemsDto.items) {
    const existingItem = order.items.find(existing => existing.product.toString() === item.itemId);
    
    if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.amount += item.amount;
    } else {
        order.items.push({ 
            product: item.itemId, 
            quantity: item.quantity, 
            amount: item.amount
        });
    }
}

    await order.save();
    return order;
  }

  async removeItemsFromOrder(id: string, removeItemsDto: RemoveItemsDto):Promise<any> {
    const order = await this.orderModel.findById(id);

    if (!order) {
        throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }

    switch (order.status) {
        case OrderStatus.PLACED:
        case OrderStatus.CONFIRMED:
        case OrderStatus.COOKING:
            break;
        case OrderStatus.COMPLETED:
          throw new BadRequestException('Không thể hủy món trong đơn hàng đã hoàn tất');
        case OrderStatus.CANCELLED:
            throw new BadRequestException('Không thể hủy món trong đơn hàng đã hủy.');
        default:
            throw new BadRequestException('Trạng thái đơn hàng không hợp lệ.');
    }

    for (const itemId of removeItemsDto.items) {
        const itemIndex = order.items.findIndex(item => item.product.toString() === itemId);
        if (itemIndex !== -1) {
            order.items.splice(itemIndex, 1);
        } else {
            throw new NotFoundException(`Không tìm thấy món với ID ${itemId} trong đơn hàng.`);
        }
    }

    await order.save();
    return order;
  }

  async getOrders(): Promise<order[]> {
    return await this.orderModel.find()
  }

  async  updateSheet(values: any) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = `Trang tính1!A2:E`;
  const resource = { values };
  await this.sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  });
  await this.sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource,
  });
  }

  async cancelOrder(orderId: string): Promise<order> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
        throw new NotFoundException('Đơn hàng không tồn tại');
    }
    switch (order.status) {
      case OrderStatus.PLACED:
      case OrderStatus.CONFIRMED:
        break;
      case OrderStatus.COOKING:
        throw new BadRequestException('Đơn hàng đang được nấu, không thể huỷ');
      case OrderStatus.COMPLETED:
          throw new BadRequestException('Đơn hàng đã hoàn thành, không thể huỷ');
      case OrderStatus.CANCELLED:
        throw new BadRequestException('Đơn hàng đã được huỷ trước đó, vui lòng kiểm tra lại');
      default:
          throw new BadRequestException('Trạng thái đơn hàng không hợp lệ.');
  }
    order.status = OrderStatus.CANCELLED;
    return await order.save();
}


  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
