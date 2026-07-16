import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ProductCharacterReorderDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  characterIds: string[];
}
