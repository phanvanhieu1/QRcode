import { IsEmpty, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, isString, IsString } from "class-validator";

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

  @IsInt()
  @IsOptional()
  status  : number;

  @IsString()
  @IsOptional()
  image  : string;
}
