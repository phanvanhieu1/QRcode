import { OrderStatus, PaymentMethod } from "@/decorator/enum";
import { product } from "@/modules/product/schemas/product.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";


@Schema()
export class OrderItem {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;
}


@Schema({timestamps: true})
export class order {

  @Prop()
  tableNumber: number;


  @Prop()
  nameGuest  : string;

  @Prop({default: 0})
  discount  : number;

  @Prop({ type: String, enum: Object.values(PaymentMethod), default: PaymentMethod.CASH }) 
  paymenMethod: PaymentMethod;

  @Prop({ type: [OrderItem], default: [] })
  items: OrderItem[];

  @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.PLACED })
  status: OrderStatus;

  @Prop({default: 0})
  customerAmount  : number;

  @Prop({default: 0})
  excessiveAmount  : number;

  @Prop({default: ""})
  userReceive  : string;

  @Prop({default: ""})
  note: string


}

export const orderSchema = SchemaFactory.createForClass(order);