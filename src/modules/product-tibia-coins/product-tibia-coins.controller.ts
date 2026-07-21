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
import { ProductTibiaCoinsService } from './product-tibia-coins.service';
import { ProductTibiaCoinsVariableDto } from './dtos/variables/variables.create.dto';
import { ProductTibiaCoinsVariableUpdateDto } from './dtos/variables/variables.update.dto';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import { ProductTibiaCoinsType } from 'src/generated/prisma/enums';
import { ProductTibiaCoinsEditDto } from './dtos/product-tibia-coins.edit.dto';
import { StockBatchCreateDto } from './dtos/stock-batch/stock-batch.create.dto';

@Controller('product-tibia-coins')
export class ProductTibiaCoinsController {
  constructor(private readonly service: ProductTibiaCoinsService) {}

  @IsPublic()
  @Get('list/public')
  listPublic(@Query('type') type?: ProductTibiaCoinsType) {
    return this.service.listPublic(type || ProductTibiaCoinsType.BUY);
  }

  @IsAdminOnly()
  @Get('list')
  list() {
    return this.service.list();
  }

  @IsAdminOnly()
  @Patch('edit/:productTibiaCoinsId')
  editProductTibiaCoins(
    @Param('productTibiaCoinsId') productTibiaCoinsId: string,
    @Body() body: ProductTibiaCoinsEditDto,
  ) {
    return this.service.editProductTibiaCoins(productTibiaCoinsId, body);
  }

  @IsAdminOnly()
  @Patch('disable/:productTibiaCoinsId')
  disable(@Param('productTibiaCoinsId') productTibiaCoinsId: string) {
    return this.service.disable(productTibiaCoinsId);
  }

  @IsAdminOnly()
  @Patch('enable/:productTibiaCoinsId')
  enable(@Param('productTibiaCoinsId') productTibiaCoinsId: string) {
    return this.service.enable(productTibiaCoinsId);
  }

  @IsAdminOnly()
  @Get('variables/list')
  listVariables() {
    return this.service.listVariables();
  }

  @IsAdminOnly()
  @Post('variables')
  createVariable(@Body() dto: ProductTibiaCoinsVariableDto) {
    return this.service.createVariable(dto);
  }

  @IsAdminOnly()
  @Patch('variables/:id')
  updateVariable(
    @Param('id') id: string,
    @Body() dto: ProductTibiaCoinsVariableUpdateDto,
  ) {
    return this.service.updateVariable(id, dto);
  }

  @IsAdminOnly()
  @Patch('variables/disable/:productTibiaCoinsVariableId')
  disableVariable(
    @Param('productTibiaCoinsVariableId')
    productTibiaCoinsVariableId: string,
  ) {
    return this.service.disableVariable(productTibiaCoinsVariableId);
  }

  @IsAdminOnly()
  @Patch('variables/enable/:productTibiaCoinsVariableId')
  enableVariable(
    @Param('productTibiaCoinsVariableId')
    productTibiaCoinsVariableId: string,
  ) {
    return this.service.enableVariable(productTibiaCoinsVariableId);
  }

  @IsAdminOnly()
  @Delete('variable/:productTibiaCoinsVariableId')
  deleteVariable(
    @Param('productTibiaCoinsVariableId')
    productTibiaCoinsVariableId: string,
  ) {
    return this.service.deleteVariable(productTibiaCoinsVariableId);
  }

  @IsAdminOnly()
  @Post('stock-batch/create')
  stockBatchCreate(@Body() body: StockBatchCreateDto) {
    return this.service.stockBatchCreate(body);
  }

  @IsAdminOnly()
  @Post('variables/upload/:variableId/image')
  uploadImage(
    @Param('variableId') variableId: string,
    @Req() req: FastifyRequest,
  ) {
    return this.service.uploadImage(variableId, req);
  }
}
