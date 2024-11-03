import { ProductStatus } from "@/decorator/enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import slugify from 'slugify';
import translate from 'google-translate-api'; // Thư viện dịch

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

  @Prop({ default: false })
  canBeReturned: boolean;
}



export const productSchema = SchemaFactory.createForClass(product);

productSchema.pre<product>('save', async function () {
  this.nameSlug = slugify(this.name, { lower: true });
  this.nameSearch = this.name.toLowerCase();
  this.nameSearchEng = this.nameEng.toLowerCase()
});