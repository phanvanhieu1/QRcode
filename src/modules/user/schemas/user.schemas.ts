import { category } from "@/modules/category/schemas/category.schemas";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class user {
  @Prop({ type: String, enum: ['ADMIN', 'EMPLOYEE', 'GUESS'], default: 'GUESS' })
  role: string;

  @Prop()
  username: string;

  @Prop()
  password  : string;

  @Prop({default:  true})
  isActive  : boolean;

}

export const userSchema = SchemaFactory.createForClass(user);