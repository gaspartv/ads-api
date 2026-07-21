import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductAccountLoyaltyService } from './product-account-loyalty.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import { ProductAccountLoyaltyListDto } from './dtos/product-account-loyalty.list.dto';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { ProductAccountLoyaltyCreateDto } from './dtos/product-account-loyalty.create.dto';
import { ProductAccountLoyaltyEditDto } from './dtos/product-account-loyalty.edit.dto';
import { CompanySign } from 'src/common/decorators/company.decorator';
import type { Company } from 'src/generated/prisma/client';

@Controller('product-account-loyalty')
export class ProductAccountLoyaltyController {
  constructor(private readonly service: ProductAccountLoyaltyService) {}

  @IsPublic()
  @Get('list/public')
  listPublic(@Query() query: ProductAccountLoyaltyListDto) {
    return this.service.list(query);
  }

  @IsAdminOnly()
  @Get('list')
  list(@Query() query: ProductAccountLoyaltyListDto) {
    return this.service.list(query);
  }

  @IsAdminOnly()
  @Post('create')
  create(
    @Body() body: ProductAccountLoyaltyCreateDto,
    @CompanySign() company: Company,
  ) {
    return this.service.create(body, company.id);
  }

  @IsAdminOnly()
  @Patch('edit/:productAccountLoyaltyId')
  edit(
    @Param('productAccountLoyaltyId') productAccountLoyaltyId: string,
    @Body() body: ProductAccountLoyaltyEditDto,
  ) {
    return this.service.edit(productAccountLoyaltyId, body);
  }

  @IsAdminOnly()
  @Delete('delete/:productAccountLoyaltyId')
  delete(@Param('productAccountLoyaltyId') productAccountLoyaltyId: string) {
    return this.service.delete(productAccountLoyaltyId);
  }

  @IsAdminOnly()
  @Patch('disable/:productAccountLoyaltyId')
  disable(@Param('productAccountLoyaltyId') productAccountLoyaltyId: string) {
    return this.service.disable(productAccountLoyaltyId);
  }

  @IsAdminOnly()
  @Patch('enable/:productAccountLoyaltyId')
  enable(@Param('productAccountLoyaltyId') productAccountLoyaltyId: string) {
    return this.service.enable(productAccountLoyaltyId);
  }
}
