import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RemoveItemsDto {
  @IsArray()
  @IsNotEmpty()
  items: string[];
}

export class CancelOrderDto {
  @IsNotEmpty()
  @IsString()
  note: string;
}
