import { Role } from '@/decorator/enum';
import { IsEmpty, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'username không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @IsEmpty()
  isActive: boolean;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
