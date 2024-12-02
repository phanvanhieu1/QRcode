import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { product } from '@/modules/product/schemas/product.schemas';

export type ComboDocument = Document & Combo;

@Schema()
export class ComboItem {
  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Combo {
  @Prop()
  name: string;

  @Prop({ type: [ComboItem], default: [] })
  items: ComboItem[];

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop([String])
  images: string[];

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const ComboSchema = SchemaFactory.createForClass(Combo);
