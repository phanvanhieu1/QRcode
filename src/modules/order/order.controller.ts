import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartDto } from './dto/create-order.dto';
import { Roles } from '@/auth/authorization/roles.decorator';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { Order } from './entities/order.entity';
import { AddItemsDto } from './dto/add-Item.dto';
import { RemoveItemsDto } from './dto/remove-item.dto';
import { Public } from '@/decorator/customize';
import { OrderStatus } from '@/decorator/enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles('GUEST')
  @UseGuards(RoleGuard)
  orderItem(@Body() data: CartDto, @Req() req) {
    return this.orderService.create(data, req.user.username);
  }

  @Post(':id/status')
  @Roles('EMPLOYEE')
  @UseGuards(RoleGuard)
  updateOrderToNextStatus(@Param('id') id: string) {
    return this.orderService.updateOrderToNextStatus(id);
  }

  @Post(':id/add-item')
  @Roles('GUEST')
  @UseGuards(RoleGuard)
  addItemToOrder(
  @Param('id') id: string,
  @Body() addItemDto: AddItemsDto
  ) {
    return this.orderService.addItemToOrder(id, addItemDto)
  }
  
  @Post(':id/remove-items')
  @Roles('GUEST')
  @UseGuards(RoleGuard)
  removeItemsFromOrder(
  @Param('id') id: string,
  @Body() removeItemsDto: RemoveItemsDto
  ) {
    return this.orderService.removeItemsFromOrder(id, removeItemsDto)
  }

  @Get(':id')
  @Roles('EMPLOYEE', 'ADMIN')
  @UseGuards(RoleGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get()
  @Roles('EMPLOYEE', 'ADMIN')
  @UseGuards(RoleGuard)
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
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
    } else if (order.status === OrderStatus.COMPLETED) {
      acc[date].completedOrders++;
      acc[date].revenue += order.totalBill;
    }

    return acc;
  }, {});
  const values = Object.keys(groupedData).map(date => {
    const { totalOrders, cancelledOrders, completedOrders, revenue } = groupedData[date];
    return [date, totalOrders, cancelledOrders, completedOrders, revenue];
  });
  this.orderService.updateSheet(values)
  return { message: 'Tất cả hóa đơn đã được đồng bộ vào Google Sheets' };
}

@Delete(':id/cancel')
@Roles('EMPLOYEE')
@UseGuards(RoleGuard)
async cancelOrder(@Param('id') orderId: string) {
    try {
        const canceledOrder = await this.orderService.cancelOrder(orderId);
        return { message: 'Đơn hàng đã được hủy', order: canceledOrder };
    } catch (error) {
        return { message: error.message };
    }
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
