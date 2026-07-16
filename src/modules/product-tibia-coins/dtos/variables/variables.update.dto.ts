import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProductTibiaCoinsVariableUpdateDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  promotionalPrice?: number;

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
