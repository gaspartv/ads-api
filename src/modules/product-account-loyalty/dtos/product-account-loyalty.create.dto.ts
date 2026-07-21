import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

enum Boolean {
  TRUE = 'true',
  FALSE = 'false',
}

export class ProductAccountLoyaltyCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  promotionalPrice?: number;

  @IsNumber()
  @IsNotEmpty()
  priceTibiaCoins: number;

  @IsNumber()
  @IsOptional()
  promotionalPriceTibiaCoins?: number;

  @IsBoolean()
  @IsNotEmpty()
  safeAddress: Boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasRecoveryKey: Boolean;

  @IsOptional()
  @IsObject()
  metadata?: {};
}
