import { IsEmpty, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsOptional, isString, IsString } from "class-validator";

export class UpdateProductDto {

  @IsNotEmpty({message: "id không được để trống"})
  @IsMongoId({message: "id không đúng định dạng"})
  _id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  nameEng  : string;

  @IsOptional()
  nameSlug  : string;

  @IsOptional()
  nameSearch  : string;

  @IsOptional()
  nameSearchEng : string;

  @IsOptional()
  description  : string;

  @IsOptional()
  price  : string;

  @IsOptional()
  status  : number;

  @IsOptional()
  image  : string;
}
