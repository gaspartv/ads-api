import { IsOptional, IsString } from 'class-validator';

export class CategoryCreateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
