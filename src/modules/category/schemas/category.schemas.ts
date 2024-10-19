import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class category {
  @Prop({required: true })
  id: string;

  @Prop()
  name: string;
}

export const categorySchema = SchemaFactory.createForClass(category);