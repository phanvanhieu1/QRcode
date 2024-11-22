import {
  IsNotEmpty,
  ValidateNested,
  IsArray,
  IsPositive,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CartItemDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'productId không đúng định dạng' })
  productId: Types.ObjectId;
  @IsNotEmpty()
  @IsPositive({ message: 'số lượng phải là số dương' })
  quantity: number;
  @IsOptional()
  amount: number;
}

export class CartDto {
  @IsNotEmpty()
  nameGuest: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
  @IsNotEmpty()
  totalBill: number;
}
