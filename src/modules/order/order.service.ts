import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { order } from './schemas/order.schemas';
import { Model, Types } from 'mongoose';
import { OrderStatus } from '@/decorator/enum';
import { RemoveItemsDto } from './dto/remove-item.dto';
import { product } from '../product/schemas/product.schemas';
import { combo } from '../combo/schemas/combo.schemas';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(order.name)
    private orderModel: Model<order>,
    // private productModel: Model<product>,
    // private comboModel: Model<combo>,
  ) {}

  async create(cartDto: CartDto, tableNum: number, userId: any) {
    const items = cartDto.items.map((item) => ({
      quantity: item.quantity,
      product: item.productId,
    }));

    const rs = await this.orderModel.create({
      sessionId: userId,
      tableNumber: tableNum,
      nameGuest: cartDto.nameGuest,
      items: items,
      type: cartDto.type,
      totalBill: cartDto.totalBill,
    });
    return rs;
  }

  async findAll(role: any) {
    let filter: any = {};
    if (role === 'CHEFF') {
      filter = {
        status: {
          $in: [
            OrderStatus.CONFIRMED,
            OrderStatus.COOKING,
            OrderStatus.COMPLETED,
          ],
        },
        inProcess: true,
      };
    } else if (role === 'EMPLOYEE' || role === 'ADMIN') {
      filter = {};
    } else {
      throw new Error('Invalid role');
    }
    const fieldsToExcludeForCheff =
      '-sessionId -discount -paymentMethod -inProcess -customerprice -excessiveprice -isDone';
    if (role === 'CHEFF') {
      return await this.orderModel
        .find(filter)
        .select(fieldsToExcludeForCheff)
        .populate({
          path: 'items.product',
          model: 'product',
        })
        .exec();
    }
    return await this.orderModel
      .find(filter)
      .populate({
        path: 'items.product',
        model: 'product',
      })
      .exec();
  }

  async findOne(id: string) {
    return await this.orderModel
      .find({
        _id: id,
      })
      .populate({
        path: 'items.product',
        model: 'product',
      })
      .exec();
  }

  async findMyOrder(sessionId: string) {
    const rs = await this.orderModel.find({ sessionId });
    if (rs.length == 0) {
      throw new NotFoundException(
        'bạn không có đơn hàng hoặc đơn hàng không hợp lệ',
      );
    }
    const a = rs[0].type;
    const orders = await this.orderModel
      .find({ sessionId })
      .populate({
        path: 'items.product',
        model: a,
      })
      .exec();

    return orders;
  }

  async requestPayment(id: string, sessionId: any, method: any): Promise<any> {
    const checkUser = await this.findMyOrder(sessionId);
    const orderExists = checkUser.some((order) => order._id.toString() === id);

    if (!orderExists) {
      throw new NotFoundException(
        `Không tìm thấy đơn hàng với ID ${id} của người dùng này`,
      );
    }
    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Đơn hàng phải ở trạng thái "Hoàn thành" để yêu cầu thanh toán',
      );
    }
    await this.orderModel.findByIdAndUpdate(
      id,
      { $set: { status: OrderStatus.PAYMENT, paymentMethod: method } },
      { new: true },
    );

    return `Đơn hàng đã yêu cầu thanh toán thành công`;
  }

  async confirmPayment(id: any): Promise<any> {
    const check = await this.orderModel.findById(id);
    if (!check) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    if (check.status !== OrderStatus.PAYMENT) {
      throw new BadRequestException(
        'Đơn hàng phải có trạng thái "Yêu cầu thanh toán" để xác nhận thanh toán',
      );
    }
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: OrderStatus.PAID,
          isDone: true,
        },
      },
      { new: true },
    );

    if (!updatedOrder) {
      throw new BadRequestException('Cập nhật trạng thái thanh toán thất bại');
    }

    return `Đơn hàng ID ${id} đã được xác nhận thanh toán thành công`;
  }

  private getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const statuses = Object.values(OrderStatus) as OrderStatus[];
    const currentIndex = statuses.indexOf(currentStatus);
    if (
      currentStatus === OrderStatus.PLACED ||
      currentStatus === OrderStatus.COMPLETED ||
      currentStatus === OrderStatus.PAID
    ) {
      return null;
    }
    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      return null;
    }

    return statuses[currentIndex + 1] as OrderStatus;
  }

  async confirmOrder(orderId: string): Promise<any> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${orderId}`);
    }

    if (order.status !== OrderStatus.PLACED) {
      throw new BadRequestException('Trạng thái đơn hàng không hợp lệ');
    }
    const rs = await this.orderModel.findByIdAndUpdate(
      orderId,
      { $set: { status: OrderStatus.CONFIRMED, inProcess: true } },
      { new: true },
    );
    return rs;
  }

  async updateOrderToNextStatus(id: string, role: any): Promise<any> {
    const order = await this.orderModel.findById({
      _id: id,
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    const allowedStatusesForCheff = [
      OrderStatus.CONFIRMED,
      OrderStatus.COOKING,
      OrderStatus.COMPLETED,
    ];
    if (role === 'CHEFF') {
      if (!allowedStatusesForCheff.includes(order.status)) {
        throw new BadRequestException(
          `CHEFF chỉ được phép cập nhật từ CONFIRMED => COOKING => COMPLETED. Hiện trạng thái là: ${order.status}`,
        );
      }
    }

    const nextStatus = this.getNextStatus(order.status);
    if (!nextStatus) {
      throw new BadRequestException('Trạng thái đơn hàng không hợp lệ');
    }

    if (role === 'CHEFF' && !allowedStatusesForCheff.includes(nextStatus)) {
      throw new BadRequestException(
        `CHEFF không được phép cập nhật trạng thái: ${nextStatus}`,
      );
    }

    const updateData: any = { status: nextStatus };
    if (nextStatus === OrderStatus.COMPLETED) {
      updateData.inProcess = false;
    }

    const rs = await this.orderModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    return rs;
  }

  // async addItemToOrder(id: string, addItemsDto: any): Promise<any> {
  //   const order = await this.orderModel.findById(id);

  //   if (!order) {
  //     throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
  //   }

  //   switch (order.status) {
  //     case OrderStatus.PLACED:
  //     case OrderStatus.CONFIRMED:
  //     case OrderStatus.COOKING:
  //       break;
  //     case OrderStatus.COMPLETED:
  //       throw new BadRequestException(
  //         'Không thể thêm món vào đơn hàng đã hoàn tất',
  //       );
  //     case OrderStatus.CANCELLED:
  //       throw new BadRequestException(
  //         'Không thể thêm món vào đơn hàng đã hủy.',
  //       );
  //     default:
  //       throw new BadRequestException('Trạng thái đơn hàng không hợp lệ.');
  //   }
  //   ///aaa

  //   for (const item of addItemsDto.items) {
  //     const existingItem = order.items.find(
  //       (existing) => existing.product.toString() === item.itemId,
  //     );

  //     if (existingItem) {
  //       existingItem.quantity += item.quantity;
  //       existingItem.price += item.price;
  //     } else {
  //       order.items.push({
  //         product: item.itemId,
  //         quantity: item.quantity,
  //         price: item.price,
  //       });
  //     }
  //   }

  //   await order.save();
  //   return order;
  // }

  async removeItemsFromOrder(
    id: string,
    removeItemsDto: RemoveItemsDto,
  ): Promise<any> {
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
        throw new BadRequestException(
          'Không thể hủy món trong đơn hàng đã hoàn tất',
        );
      case OrderStatus.CANCELLED:
        throw new BadRequestException(
          'Không thể hủy món trong đơn hàng đã hủy.',
        );
      default:
        throw new BadRequestException('Trạng thái đơn hàng không hợp lệ.');
    }

    for (const itemId of removeItemsDto.items) {
      const itemIndex = order.items.findIndex(
        (item) => item.product.toString() === itemId,
      );
      if (itemIndex !== -1) {
        order.items.splice(itemIndex, 1) &&
          order.note.push(removeItemsDto.note);
      } else {
        throw new NotFoundException(
          `Không tìm thấy món với ID ${itemId} trong đơn hàng.`,
        );
      }
    }

    await order.save();
    return order;
  }

  async getOrders(): Promise<order[]> {
    return await this.orderModel.find();
  }

  async cancelOrder(orderId: string, note: any): Promise<order> {
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
        throw new BadRequestException(
          'Đơn hàng đã được huỷ trước đó, vui lòng kiểm tra lại',
        );
      default:
        throw new BadRequestException('Trạng thái đơn hàng không hợp lệ.');
    }
    order.status = OrderStatus.CANCELLED;
    order.note = note;
    return await order.save();
  }

  async deleteAllOrders(): Promise<{ deletedCount: number }> {
    const result = await this.orderModel.deleteMany({});
    return { deletedCount: result.deletedCount }; // Số lượng đơn hàng đã bị xóa
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
