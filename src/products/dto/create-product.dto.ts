import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsString()
  image: string;

  @IsArray()
  size: string[];

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsArray()
  color: string[];

  @IsOptional()
  @IsString()
  quota: string;

  @IsOptional()
  @IsString()
  quotaPrice: string;

  @IsOptional()
  @IsString()
  discount: string;

  @IsOptional()
  @IsBoolean()
  available: boolean;
}
