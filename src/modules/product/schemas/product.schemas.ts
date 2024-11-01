import { ProductStatus } from "@/decorator/enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type productDocument = HydratedDocument<product>;
@Schema({timestamps: true})
export class product {
  @Prop()
  name: string;

  @Prop()
  nameEng  : string;

  @Prop()
  nameSlug  : string; 

  @Prop()
  nameSearch  : string;

  @Prop()
  nameSearchEng : string;

  @Prop()
  description  : string;

  @Prop()
  price  : string;

  @Prop({ enum: Object.values(ProductStatus), default: ProductStatus.IN_STOCK }) 
  status: ProductStatus; 
  @Prop()
  image  : string;

  @Prop()
  category  : string;
}

export const productSchema = SchemaFactory.createForClass(product);