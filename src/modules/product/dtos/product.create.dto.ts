import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { ProductType } from 'src/generated/prisma/enums';

export class ProductCreateDto {
  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @IsBoolean()
  @IsNotEmpty()
  isFixed: boolean;

  @IsBoolean()
  @IsNotEmpty()
  featured: boolean;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  metadata: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNumber()
  promotionalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  multiples: number;

  @IsOptional()
  @IsString()
  seoTitle: string;

  @IsOptional()
  @IsString()
  seoDescription: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categoryIds: string[];

  @IsNumber()
  @IsNotEmpty()
  costPrice: number;

  @IsString()
  @IsOptional()
  supplierName: string;
}
