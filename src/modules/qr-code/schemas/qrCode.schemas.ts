import { category } from "@/modules/category/schemas/category.schemas";
import { employee } from "@/modules/employee/schemas/employee.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class qrCode {
  @Prop({require:  true})
  id: string;

  @Prop()
  tableNumber: number;

  @Prop()
  code  : string;

}

export const qrCodeSchema = SchemaFactory.createForClass(qrCode);