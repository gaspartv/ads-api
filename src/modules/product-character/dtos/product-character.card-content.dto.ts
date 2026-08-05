import { IsArray, IsString } from 'class-validator';

export class ProductCharacterCardContentDto {
  @IsArray()
  @IsString({ each: true })
  cardContent: string[];
}
