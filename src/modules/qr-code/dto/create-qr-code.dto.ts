import { IsNotEmpty, IsString } from "class-validator";

export class CreateQrCodeDto {

  @IsNotEmpty()
  @IsString()
  tableNumber: string;


}
