import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { product } from '@/modules/product/schemas/product.schemas';

export type comboDocument = Document & combo;

@Schema()
export class comboItem {
  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;
}

@Schema({ timestamps: true })
export class combo {
  @Prop()
  name: string;

  @Prop({ type: [comboItem], default: [] })
  items: comboItem[];

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

export const comboSchema = SchemaFactory.createForClass(combo);
