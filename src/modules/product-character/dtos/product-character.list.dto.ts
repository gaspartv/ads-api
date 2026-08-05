import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { BattleyeType, PvpType } from 'src/generated/prisma/enums';

export class ProductCharacterListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['ativo', 'inativo'])
  status?: 'ativo' | 'inativo';

  @IsOptional()
  @IsEnum(['true', 'false'])
  featured?: 'true' | 'false';

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;

  @IsOptional()
  @IsString()
  minPriceTibiaCoins?: string;

  @IsOptional()
  @IsString()
  maxPriceTibiaCoins?: string;

  @IsOptional()
  @IsString()
  vocation?: string;

  @IsOptional()
  @IsString()
  minLevel?: string;

  @IsOptional()
  @IsString()
  maxLevel?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  minLoyalty?: string;

  @IsOptional()
  @IsString()
  maxLoyalty?: string;

  @IsOptional()
  @IsString()
  worldId?: string;

  @IsOptional()
  @IsString()
  minMagicLevel?: string;

  @IsOptional()
  @IsString()
  maxMagicLevel?: string;

  @IsOptional()
  @IsString()
  minFistFighting?: string;

  @IsOptional()
  @IsString()
  maxFistFighting?: string;

  @IsOptional()
  @IsString()
  minSwordFighting?: string;

  @IsOptional()
  @IsString()
  maxSwordFighting?: string;

  @IsOptional()
  @IsString()
  minAxeFighting?: string;

  @IsOptional()
  @IsString()
  maxAxeFighting?: string;

  @IsOptional()
  @IsString()
  minClubFighting?: string;

  @IsOptional()
  @IsString()
  maxClubFighting?: string;

  @IsOptional()
  @IsString()
  minDistanceFighting?: string;

  @IsOptional()
  @IsString()
  maxDistanceFighting?: string;

  @IsOptional()
  @IsString()
  minShielding?: string;

  @IsOptional()
  @IsString()
  maxShielding?: string;

  @IsOptional()
  @IsString()
  minFishing?: string;

  @IsOptional()
  @IsString()
  maxFishing?: string;

  @IsOptional()
  @IsString()
  minCharmPoints?: string;

  @IsOptional()
  @IsString()
  maxCharmPoints?: string;

  @IsOptional()
  @IsEnum(['true', 'false'])
  charmExpansion?: 'true' | 'false';

  @IsOptional()
  @IsEnum(['true', 'false'])
  transferable?: 'true' | 'false';

  @IsOptional()
  @IsEnum(['true', 'false'])
  hasRecoveryKey?: 'true' | 'false';

  @IsOptional()
  @IsEnum(['true', 'false'])
  safeAddress?: 'true' | 'false';

  @IsEnum(BattleyeType)
  @IsOptional()
  battleye?: BattleyeType;

  @IsEnum(PvpType)
  @IsOptional()
  pvpType?: PvpType;
}
