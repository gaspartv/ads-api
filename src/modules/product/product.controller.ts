import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product.create.dto';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { ProductListDto } from './dtos/product.list.dto';
import { ProductEditDto } from './dtos/product.edit.dto';
import { ImageReorderDto } from './dtos/image.reorder.dto';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @IsPublic()
  @Get('list/by-type')
  listByCategoryId(@Query() query: ProductListDto) {
    return this.service.listByCategoryId(query);
  }

  @IsAdminOnly()
  @Get('list')
  list(@Query() query: ProductListDto) {
    return this.service.list(query);
  }

  @IsAdminOnly()
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: ProductCreateDto) {
    return this.service.create(body);
  }

  @IsAdminOnly()
  @Delete('delete/:productId')
  delete(@Param('productId') productId: string) {
    return this.service.delete(productId);
  }

  @IsAdminOnly()
  @Patch('disable/:productId')
  disable(@Param('productId') productId: string) {
    return this.service.disable(productId);
  }

  @IsAdminOnly()
  @Patch('enable/:productId')
  enable(@Param('productId') productId: string) {
    return this.service.enable(productId);
  }

  @IsAdminOnly()
  @Patch('edit/:productId')
  edit(@Param('productId') productId: string, @Body() body: ProductEditDto) {
    return this.service.edit(productId, body);
  }

  @IsAdminOnly()
  @Post('upload/:productId/image')
  uploadImage(
    @Param('productId') productId: string,
    @Req() req: FastifyRequest,
  ) {
    return this.service.uploadImage(productId, req);
  }

  @IsAdminOnly()
  @Delete('delete/:productId/image/:imageId')
  deleteImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.service.deleteImage(productId, imageId);
  }

  @IsAdminOnly()
  @Patch('reorder/:productId/images')
  reorderImages(
    @Param('productId') productId: string,
    @Body() body: ImageReorderDto,
  ) {
    return this.service.reorderImages(productId, body);
  }
}
