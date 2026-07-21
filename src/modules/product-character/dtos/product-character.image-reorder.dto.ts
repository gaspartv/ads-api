import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ProductCharacterImageReorderDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  imageIds: string[];
}
