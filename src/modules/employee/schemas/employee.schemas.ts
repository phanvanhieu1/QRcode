import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class employee {
  @Prop({require:  true})
  id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName  : string;

  @Prop()
  isActive  : boolean;
}

export const employeeSchema = SchemaFactory.createForClass(employee);