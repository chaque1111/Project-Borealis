import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email?: string;
  @IsNotEmpty()
  password?: string;
}
