import { category } from "@/modules/category/schemas/category.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class qrCode {
  @Prop()
  userName: string;

  @Prop()
  password: string;

  @Prop()
  tableNumber: string;

  @Prop({default: "GUESS"})
  role: string;

  @Prop({ type: String, enum: ['NOT_USED', 'USED'], default: 'USED' })
  status: string;

  @Prop({default: ""})
  code  : string;

}

export const qrCodeSchema = SchemaFactory.createForClass(qrCode);