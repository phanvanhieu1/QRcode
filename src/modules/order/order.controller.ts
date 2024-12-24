import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartDto } from './dto/create-order.dto';
import { Roles } from '@/auth/authorization/roles.decorator';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { Order } from './entities/order.entity';
import { AddItemsDto } from './dto/add-Item.dto';
import { CancelOrderDto, RemoveItemsDto } from './dto/remove-item.dto';
import { OrderStatus } from '@/decorator/enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles('GUEST')
  @UseGuards(RoleGuard)
  orderItem(@Body() data: CartDto, @Req() req) {
    return this.orderService.create(data, req.user.username, req.user.userId);
  }

  @Post(':id/requestPayment')
  @Roles('GUEST')
  @UseGuards(RoleGuard)
  requestPayment(@Param('id') id: string, @Req() req) {
    return this.orderService.requestPayment(
      id,
      req.user.userId,
      req.body.method,
    );
  }

  @Post(':id/confirmPayment')
  @Roles('EMPLOYEE')
  @UseGuards(RoleGuard)
  confirmPayment(@Param('id') id: string) {
    return this.orderService.confirmPayment(id);
  }

  @Post(':id/confirm')
  @Roles('EMPLOYEE')
  @UseGuards(RoleGuard)
  confirmOrder(@Param('id') id: string) {
    return this.orderService.confirmOrder(id);
  }

  @Post(':id/status')
  @Roles('CHEFF')
  @UseGuards(RoleGuard)
  updateOrderToNextStatus(@Param('id') id: string, @Req() req) {
    return this.orderService.updateOrderToNextStatus(id, req.user.role);
  }

  // @Post(':id/add-item')
  // @Roles('GUEST')
  // @UseGuards(RoleGuard)
  // addItemToOrder(@Param('id') id: string, @Body() addItemDto: AddItemsDto) {
  //   return this.orderService.addItemToOrder(id, addItemDto);
  // }

  @Post(':id/remove-items')
  @Roles('EMPLOYEE')
  @UseGuards(RoleGuard)
  removeItemsFromOrder(
    @Param('id') id: string,
    @Body() removeItemsDto: RemoveItemsDto,
  ) {
    return this.orderService.removeItemsFromOrder(id, removeItemsDto);
  }

  @Get('myorder')
  @Roles('GUEST')
  @UseGuards(RoleGuard)
  findMyOrder(@Req() req): Promise<Order[]> {
    return this.orderService.findMyOrder(req.user.userId);
  }

  @Get(':id')
  @Roles('EMPLOYEE', 'ADMIN')
  @UseGuards(RoleGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get()
  @Roles('EMPLOYEE', 'ADMIN', 'CHEFF')
  @UseGuards(RoleGuard)
  findAll(@Req() req): Promise<Order[]> {
    return this.orderService.findAll(req.user.role);
  }

  @Post('sync-all-orders')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async syncAllOrdersToSheet() {
    const orders = await this.orderService.getOrders();
    const groupedData = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().slice(0, 10);
      if (!acc[date]) {
        acc[date] = {
          totalOrders: 0,
          cancelledOrders: 0,
          completedOrders: 0,
          revenue: 0,
        };
      }

      acc[date].totalOrders++;
      if (order.status === OrderStatus.CANCELLED) {
        acc[date].cancelledOrders++;
      } else if (order.status === OrderStatus.PAID) {
        acc[date].completedOrders++;
        acc[date].revenue += order.totalBill;
      }

      return acc;
    }, {});
    const values = Object.keys(groupedData).map((date) => {
      const { totalOrders, cancelledOrders, completedOrders, revenue } =
        groupedData[date];
      return { date, totalOrders, cancelledOrders, completedOrders, revenue };
    });
    return values;
  }

  @Post(':id/cancel')
  @Roles('EMPLOYEE')
  @UseGuards(RoleGuard)
  async cancelOrder(
    @Param('id') orderId: string,
    @Body() note: CancelOrderDto,
  ) {
    try {
      const canceledOrder = await this.orderService.cancelOrder(
        orderId,
        note.note,
      );
      return { message: 'Đơn hàng đã được hủy', order: canceledOrder };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete('delete-all')
  @Roles('ROOT')
  @UseGuards(RoleGuard)
  async deleteAllOrders() {
    return await this.orderService.deleteAllOrders();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
