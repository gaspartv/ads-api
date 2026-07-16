import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProductTibiaCoinsVariableDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  promotionalPrice?: number;

  @IsOptional()
  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;

  @IsOptional()
  @IsUrl()
  url?: string;
}
