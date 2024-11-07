import { ProductCategory } from "@/decorator/enum";
import { IsArray, IsEmpty, IsEnum, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, isString, IsString } from "class-validator";

export class CreateProductDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  nameEng  : string;

  @IsString()
  @IsOptional()
  nameSlug  : string;

  @IsString()
  @IsOptional()
  nameSearch  : string;

  @IsString()
  @IsOptional()
  nameSearchEng : string;

  @IsString()
  @IsOptional()
  description  : string;

  @IsString()
  price  : string;

  @IsEnum(ProductCategory)
  @IsNotEmpty()
  category  : ProductCategory;

  @IsOptional()
  canBeReturned: boolean;

  @IsArray()
  @IsOptional()
  images: string[];
}
