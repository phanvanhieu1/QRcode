import { IsNotEmpty, IsString } from "class-validator";

export class loginQrCodeDto {

  @IsNotEmpty()
  tableNumber: string;


}
