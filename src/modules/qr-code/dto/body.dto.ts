import { IsNotEmpty, IsString } from "class-validator";

export class bodyQrCodeDto {

  @IsNotEmpty()
  password: string;


}
