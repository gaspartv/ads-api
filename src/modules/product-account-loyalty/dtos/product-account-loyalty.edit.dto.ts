import {
  IsEnum,
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

export class ProductAccountLoyaltyEditDto {
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

  @IsEnum(Boolean)
  @IsNotEmpty()
  safeAddress: Boolean;

  @IsEnum(Boolean)
  @IsNotEmpty()
  hasRecoveryKey: Boolean;

  @IsOptional()
  @IsObject()
  metadata?: {};
}
