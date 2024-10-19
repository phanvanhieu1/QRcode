import { category } from "@/modules/category/schemas/category.schemas";
import { employee } from "@/modules/employee/schemas/employee.schemas";
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

  @Prop()
  status  : number;

  @Prop()
  image  : string;

  @Prop({ref: category.name})
  category  : string;
}

export const productSchema = SchemaFactory.createForClass(product);