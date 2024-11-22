import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class user {
  @Prop({
    type: String,
    enum: ['ADMIN', 'EMPLOYEE', 'GUEST', 'CHEFF'],
    default: 'GUEST',
  })
  role: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const userSchema = SchemaFactory.createForClass(user);
