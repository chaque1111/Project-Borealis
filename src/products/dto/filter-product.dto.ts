import { IsObject, IsOptional, IsString } from 'class-validator';

export class filterProductDto {
  @IsObject()
  @IsOptional()
  price: object;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  size: string;
}
