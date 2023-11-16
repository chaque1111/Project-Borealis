import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class registerAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Length(5, 10)
  username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phoneNumber: string;
}
