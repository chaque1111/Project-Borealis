import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  @IsOptional()
  size: string[];

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  color: [[]];

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
