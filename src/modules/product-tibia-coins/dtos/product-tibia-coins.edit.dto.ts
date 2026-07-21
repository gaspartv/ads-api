import { IsOptional, IsString } from 'class-validator';

export class ProductTibiaCoinsEditDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;
}
