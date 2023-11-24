import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  price: string;

  image: any;

  @IsArray()
  size: string[];

  @IsString()
  category: string;

  @IsArray()
  color: string[];

  @IsOptional()
  @IsString()
  description: string;

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
