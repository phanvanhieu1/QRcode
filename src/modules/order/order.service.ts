import { Injectable } from '@nestjs/common';
import { CartDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { order } from './schemas/order.schemas';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(order.name) 
    private orderModel: Model<order>
  ) {}

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

  async findOne(id: number) {
    return await this.orderModel.find({
      _id : id
    }).populate({
      path: 'items.product',
      model: 'product',
    })
    .exec();
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
