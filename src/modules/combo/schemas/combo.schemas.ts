import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { product } from "@/modules/product/schemas/product.schemas";

export type ComboDocument = Document & Combo;

@Schema({ timestamps: true })
export class Combo {
  @Prop()
  name: string;

  @Prop({ type: [Types.ObjectId], ref: product.name })
  items: Types.ObjectId[]; 

  @Prop({ required: true })
  price: number; 

  @Prop()
  description: string; 

  @Prop([String])
  image: string[]; 

  @Prop({ default: true })
  isActive: boolean;
}

export const ComboSchema = SchemaFactory.createForClass(Combo);
