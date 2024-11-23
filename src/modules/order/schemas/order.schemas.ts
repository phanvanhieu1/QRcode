import { OrderStatus, PaymentMethod } from '@/decorator/enum';
import { product } from '@/modules/product/schemas/product.schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema()
export class OrderItem {
  @Prop({ required: true })
  quantity: number;

  @Prop()
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;
}

@Schema({ timestamps: true })
export class order {
  @Prop({ required: true })
  sessionId: string;

  @Prop()
  tableNumber: number;

  @Prop()
  nameGuest: string;

  @Prop({ default: 0 })
  discount: number;

  @Prop({
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Prop({ type: [OrderItem], default: [] })
  items: OrderItem[];

  @Prop({ default: 0 })
  totalBill: number;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  @Prop({ default: false })
  inProcess: boolean;

  @Prop({ default: false })
  isDone: boolean;

  @Prop({ default: 0 })
  customerAmount: number;

  @Prop({ default: 0 })
  excessiveAmount: number;

  @Prop({ default: '' })
  userReceive: string;

  @Prop({ default: '' })
  note: string;

  @Prop({ type: [OrderItem], default: [] })
  returnedItems: OrderItem[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const orderSchema = SchemaFactory.createForClass(order);
orderSchema.pre<order>('save', function (next) {
  this.totalBill = this.items.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0,
  );
  next();
});
