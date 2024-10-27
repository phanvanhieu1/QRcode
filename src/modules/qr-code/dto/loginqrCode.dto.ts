import { IsNotEmpty, IsString } from "class-validator";

export class loginQrCodeDto {

  @IsNotEmpty({message: "asdas"})
  table: string;


}
