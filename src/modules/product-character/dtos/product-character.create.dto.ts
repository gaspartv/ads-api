import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, Vocations, OutfitLevel } from 'src/generated/prisma/enums';

export class CharacterOutfitDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(OutfitLevel)
  @IsNotEmpty()
  level: OutfitLevel;
}

enum Boolean {
  TRUE = 'true',
  FALSE = 'false',
}

export class ProductCharacterCreateDto {
  @IsEnum(Boolean)
  @IsNotEmpty()
  isFeatured: Boolean;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

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

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsEnum(Vocations)
  vocation: Vocations;

  @IsNumber()
  @IsNotEmpty()
  level: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(50)
  loyalty: number;

  @IsString()
  @IsNotEmpty()
  worldId: string;

  @IsNumber()
  @IsNotEmpty()
  magicLevel: number;

  @IsNumber()
  @IsOptional()
  fistFighting?: number;

  @IsNumber()
  @IsOptional()
  swordFighting?: number;

  @IsNumber()
  @IsOptional()
  axeFighting?: number;

  @IsNumber()
  @IsOptional()
  clubFighting?: number;

  @IsNumber()
  @IsOptional()
  distanceFighting?: number;

  @IsNumber()
  @IsNotEmpty()
  shielding: number;

  @IsNumber()
  @IsNotEmpty()
  charmPoints: number;

  @IsEnum(Boolean)
  @IsNotEmpty()
  charmExpansion: Boolean;

  @IsArray()
  @IsNotEmpty()
  charmsId: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterOutfitDto)
  @IsNotEmpty()
  outfits: CharacterOutfitDto[];

  @IsArray()
  @IsNotEmpty()
  mountsId: string[];

  @IsNumber()
  @IsOptional()
  inventoryValue?: number;

  @IsEnum(Boolean)
  @IsNotEmpty()
  transferable: Boolean;

  @IsOptional()
  @IsDate()
  depositransferAvailableAt?: Date;

  @IsOptional()
  @IsDate()
  premiumEndsAt?: Date;

  @IsEnum(Boolean)
  @IsNotEmpty()
  hasRecoveryKey: Boolean;

  @IsEnum(Boolean)
  @IsNotEmpty()
  safeAddress: Boolean;

  @IsOptional()
  @IsObject()
  metadata?: {};
}
