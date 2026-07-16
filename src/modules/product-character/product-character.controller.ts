import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ProductCharacterService } from './product-character.service';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { ProductCharacterCreateDto } from './dtos/product-character.create.dto';
import { ProductCharacterListDto } from './dtos/product-character.list.dto';
import { ProductCharacterEditDto } from './dtos/product-character.edit.dto';
import { ProductCharacterReorderDto } from './dtos/product-character.reorder.dto';
import { ImageReorderDto } from '../product/dtos/image.reorder.dto';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

@Controller('product-character')
export class ProductCharacterController {
  constructor(private readonly service: ProductCharacterService) {}

  @IsPublic()
  @Get('find/:slug/public')
  findPublic(@Param('slug') slug: string) {
    return this.service.findPublic(slug);
  }

  @IsPublic()
  @Get('list/public')
  listPublic(@Query() query: ProductCharacterListDto) {
    return this.service.list(query);
  }

  @IsAdminOnly()
  @Post('create')
  async createCharacter(@Body() body: ProductCharacterCreateDto) {
    return this.service.create(body);
  }

  @IsAdminOnly()
  @Get('list')
  list(@Query() query: ProductCharacterListDto) {
    return this.service.list(query);
  }

  @IsAdminOnly()
  @Patch('edit/:characterId')
  edit(
    @Param('characterId') characterId: string,
    @Body() body: ProductCharacterEditDto,
  ) {
    return this.service.edit(characterId, body);
  }

  @IsAdminOnly()
  @Patch('enable/:characterId')
  enable(@Param('characterId') characterId: string) {
    return this.service.enable(characterId);
  }

  @IsAdminOnly()
  @Patch('disable/:characterId')
  disable(@Param('characterId') characterId: string) {
    return this.service.disable(characterId);
  }

  @IsAdminOnly()
  @Delete('delete/:characterId')
  delete(@Param('characterId') characterId: string) {
    return this.service.delete(characterId);
  }

  @IsAdminOnly()
  @Post('upload/:characterId/image')
  uploadImage(
    @Param('characterId') characterId: string,
    @Req() req: FastifyRequest,
  ) {
    return this.service.uploadImage(characterId, req);
  }

  @IsAdminOnly()
  @Delete('delete/:characterId/image/:imageId')
  deleteImage(
    @Param('characterId') characterId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.service.deleteImage(characterId, imageId);
  }

  @IsAdminOnly()
  @Patch('reorder/:characterId/images')
  reorderImages(
    @Param('characterId') characterId: string,
    @Body() body: ImageReorderDto,
  ) {
    return this.service.reorderImages(characterId, body);
  }

  @IsAdminOnly()
  @Patch('reorder')
  reorderCharacters(@Body() body: ProductCharacterReorderDto) {
    return this.service.reorderCharacters(body);
  }
}
