import { category } from "@/modules/category/schemas/category.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class qrCode {
  @Prop()
  tableNumber: string;

  @Prop()
  code: string;

}

export const qrCodeSchema = SchemaFactory.createForClass(qrCode);