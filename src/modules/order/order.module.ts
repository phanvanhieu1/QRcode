import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { order, orderSchema } from './schemas/order.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: order.name, schema: orderSchema }])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
