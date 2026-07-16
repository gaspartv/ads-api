import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { ProductType } from 'src/generated/prisma/enums';

export class ProductListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['ativo', 'inativo'])
  status?: 'ativo' | 'inativo';

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsEnum(['true', 'false'])
  featured?: 'true' | 'false';

  @IsOptional()
  @IsString()
  categoryId?: string;
}
