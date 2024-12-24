import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RemoveItemsDto {
  @IsArray()
  @IsNotEmpty()
  items: string[];
  @IsNotEmpty()
  @IsString()
  note: string;
}

export class CancelOrderDto {
  @IsNotEmpty()
  @IsString()
  note: string;
}
