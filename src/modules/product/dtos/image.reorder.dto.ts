import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ImageReorderDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  imageIds: string[];
}
