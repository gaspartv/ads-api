import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

export class CategoryListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
