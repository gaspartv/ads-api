import { PartialType } from '@nestjs/mapped-types';
import { ProductCharacterCreateDto } from './product-character.create.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductCharacterEditDto extends PartialType(ProductCharacterCreateDto) {
  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  slug?: string;
}
