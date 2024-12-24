import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
class comboItemDto {
  @IsNumber()
  quantity: string;

  @IsMongoId()
  product: string;
}

export class CreatecomboDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => comboItemDto)
  items?: comboItemDto[];

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsArray()
  @IsOptional()
  images: string[];
}
