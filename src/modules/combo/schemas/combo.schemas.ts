import { product } from "@/modules/product/schemas/product.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class combo {
  @Prop({require:  true})
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref:product.name})
  item: mongoose.Schema.Types.ObjectId;

  @Prop()
  pre_price: string;

  @Prop()
  discount: string;

  @Prop()
  later_price: string;
}

export const comboSchema = SchemaFactory.createForClass(combo);