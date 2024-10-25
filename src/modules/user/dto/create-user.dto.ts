import { Optional } from "@nestjs/common";
import { IsEmpty, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsEmpty()
  role: string;

  @IsNotEmpty({message: "username không được để trống"})
  username: string;

  @IsNotEmpty({message: "password không được để trống"})
  password  : string;

  @IsEmpty()
  isActive  : boolean;

}
