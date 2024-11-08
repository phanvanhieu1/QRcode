import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class qrCode {
  @Prop()
  tableNumber: string;

  @Prop()
  code: string;

}

export const qrCodeSchema = SchemaFactory.createForClass(qrCode);