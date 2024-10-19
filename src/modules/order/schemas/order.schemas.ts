import { employee } from "@/modules/employee/schemas/employee.schemas";
import { product } from "@/modules/product/schemas/product.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class order {
  @Prop({require:  true})
  id: string;

  @Prop()
  tableNumber: number;

  @Prop()
  code  : string;

  @Prop()
  userName  : string;

  @Prop()
  discount  : number;

  @Prop()
  paymenMethod  : [1,2,3];

  @Prop({ref:product.name})
  item  : [
    quantiti: number,
    amount: number,
    product: product
  ];

  @Prop()
  status  : number;

  @Prop()
  customerAmount  : string;

  @Prop()
  excessiveAmount  : string;

  @Prop({ref: employee.name})
  userReceive  : string;


}

export const orderSchema = SchemaFactory.createForClass(order);