import { product } from "@/modules/product/schemas/product.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({timestamps: true})
export class order {

  @Prop()
  tableNumber: number;

  @Prop()
  code  : string;

  @Prop()
  userName  : string;

  @Prop({default: 0})
  discount  : number;

  @Prop({ type: String, enum: ["TM", "CK"]})
  paymenMethod: string;

  @Prop({
    type: [{
      quantiti: { type: Number, required: true },
      amount: { type: Number, required: true },
      product: { type: Types.ObjectId, ref: 'Product', required: true },
    }],
    default: [],
  })
  item: [];

  @Prop()
  status  : number;

  @Prop()
  customerAmount  : string;

  @Prop()
  excessiveAmount  : string;

  @Prop()
  userReceive  : string;


}

export const orderSchema = SchemaFactory.createForClass(order);