import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartDto } from './dto/create-order.dto';
import { Roles } from '@/auth/authorization/roles.decorator';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles('GUEST')
  @UseGuards(RoleGuard)
  orderItem(@Body() data: CartDto, @Req() req) {
    return this.orderService.create(data, req.user.username);
  }

  @Get()
  @Roles('EMPLOYEE', 'ADMIN')
  @UseGuards(RoleGuard)
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Roles('EMPLOYEE', 'ADMIN')
  @UseGuards(RoleGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
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
