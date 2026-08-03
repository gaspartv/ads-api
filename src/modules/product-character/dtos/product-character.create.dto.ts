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
  magicLevelExtra?: number;

  @IsNumber()
  @IsOptional()
  fistFighting?: number;

  @IsNumber()
  @IsOptional()
  fistFightingExtra?: number;

  @IsNumber()
  @IsOptional()
  swordFighting?: number;

  @IsNumber()
  @IsOptional()
  swordFightingExtra?: number;

  @IsNumber()
  @IsOptional()
  axeFighting?: number;

  @IsNumber()
  @IsOptional()
  axeFightingExtra?: number;

  @IsNumber()
  @IsOptional()
  clubFighting?: number;

  @IsNumber()
  @IsOptional()
  clubFightingExtra?: number;

  @IsNumber()
  @IsOptional()
  distanceFighting?: number;

  @IsNumber()
  @IsOptional()
  distanceFightingExtra?: number;

  @IsNumber()
  @IsOptional()
  fishing?: number;

  @IsNumber()
  @IsOptional()
  fishingExtra?: number;

  @IsNumber()
  @IsOptional()
  shielding?: number;

  @IsNumber()
  @IsOptional()
  shieldingExtra?: number;

  @IsNumber()
  @IsNotEmpty()
  charmPoints: number;

  @IsEnum(Boolean)
  @IsNotEmpty()
  charmExpansion: Boolean;

  @IsArray()
  @IsOptional()
  charmsId: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterOutfitDto)
  @IsOptional()
  outfits: CharacterOutfitDto[];

  @IsArray()
  @IsOptional()
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

  @IsString()
  @IsOptional()
  pictureUrl?: string;

  @IsString()
  @IsOptional()
  pictureOutfitId?: string;

  @IsString()
  @IsOptional()
  pictureOutfitLevel?: string;

  @IsOptional()
  @IsObject()
  metadata?: {};
}
