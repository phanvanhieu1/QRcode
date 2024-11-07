import { ProductCategory, ProductStatus } from "@/decorator/enum";
import { IsArray, IsBoolean, IsEmpty, IsEnum, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsOptional, isString, IsString } from "class-validator";

export class UpdateProductDto {

  @IsNotEmpty({message: "id không được để trống"})
  @IsMongoId({message: "id không đúng định dạng"})
  _id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nameEng?: string;

  @IsOptional()
  @IsString()
  nameSlug?: string;

  @IsOptional()
  @IsString()
  nameSearch?: string;

  @IsOptional()
  @IsString()
  nameSearchEng?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsBoolean()
  canBeReturned?: boolean;

  @IsArray()
  @IsOptional()
  images?: string[];
}
