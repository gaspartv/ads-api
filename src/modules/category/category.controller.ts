import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { CategoryService } from './category.service';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { CategoryCreateDto } from './dtos/category.create.dto';
import { CategoryEditDto } from './dtos/category.edit.dto';
import { CategoryListDto } from './dtos/category.list.dto';
import { ImageReorderDto } from './dtos/image.reorder.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination.dto';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @IsPublic()
  @Get('list-for-home')
  listForHome() {
    return this.service.listForHome();
  }

  @IsPublic()
  @Get('list/products')
  listProducts() {
    return this.service.listProducts();
  }

  @IsPublic()
  @Get('list-for-select')
  listForSelect() {
    return this.service.listForSelect();
  }

  @IsAdminOnly()
  @Get('list')
  list(@Query() query: CategoryListDto): Promise<PaginationResponseDto<any>> {
    return this.service.list(query);
  }

  @IsAdminOnly()
  @Post('create')
  create(@Body() body: CategoryCreateDto): Promise<{ message: string }> {
    return this.service.create(body);
  }

  @IsAdminOnly()
  @Put('edit/:categoryId')
  edit(
    @Param('categoryId') categoryId: string,
    @Body() body: CategoryEditDto,
  ): Promise<{ message: string }> {
    return this.service.edit(categoryId, body);
  }

  @IsAdminOnly()
  @Delete('delete/:categoryId')
  delete(
    @Param('categoryId') categoryId: string,
  ): Promise<{ message: string }> {
    return this.service.delete(categoryId);
  }

  @IsAdminOnly()
  @Patch('disable/:categoryId')
  disable(
    @Param('categoryId') categoryId: string,
  ): Promise<{ message: string }> {
    return this.service.disable(categoryId);
  }

  @IsAdminOnly()
  @Patch('enable/:categoryId')
  enable(
    @Param('categoryId') categoryId: string,
  ): Promise<{ message: string }> {
    return this.service.enable(categoryId);
  }

  @IsAdminOnly()
  @Post('upload/:categoryId/image')
  uploadImage(
    @Param('categoryId') categoryId: string,
    @Req() req: FastifyRequest,
  ) {
    return this.service.uploadImage(categoryId, req);
  }

  @IsAdminOnly()
  @Delete('delete/:categoryId/image/:imageId')
  deleteImage(
    @Param('categoryId') categoryId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.service.deleteImage(categoryId, imageId);
  }

  @IsAdminOnly()
  @Patch('reorder/:categoryId/images')
  reorderImages(
    @Param('categoryId') categoryId: string,
    @Body() body: ImageReorderDto,
  ) {
    return this.service.reorderImages(categoryId, body);
  }
}
