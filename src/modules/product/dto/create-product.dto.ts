import { IsEmpty, IsInt, IsNotEmpty, IsNumber, IsNumberString, isString, IsString } from "class-validator";

export class CreateProductDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  nameEng  : string;

  @IsString()
  nameSlug  : string;

  @IsString()
  nameSearch  : string;

  @IsString()
  nameSearchEng : string;

  @IsString()
  description  : string;

  @IsString()
  price  : string;

  @IsInt()
  status  : number;

  @IsString()
  image  : string;
}
