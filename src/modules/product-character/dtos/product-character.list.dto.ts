import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

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
}
