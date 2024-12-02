import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class ItemDto {
  @IsNotEmpty()
  itemId: string;
  @IsPositive()
  quantity: number;
  @IsPositive()
  price: number;
}

export class AddItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
