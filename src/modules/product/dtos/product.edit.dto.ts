import { PartialType } from '@nestjs/mapped-types';
import { ProductCreateDto } from './product.create.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductEditDto extends PartialType(ProductCreateDto) {
  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  slug?: string;
}
