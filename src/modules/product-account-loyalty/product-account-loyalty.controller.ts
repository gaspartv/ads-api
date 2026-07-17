import { Controller, Get, Query } from '@nestjs/common';
import { ProductAccountLoyaltyService } from './product-account-loyalty.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import { ProductAccountLoyaltyListDto } from './dtos/product-account-loyalty.list.dto';

@Controller('product-account-loyalty')
export class ProductAccountLoyaltyController {
  constructor(private readonly service: ProductAccountLoyaltyService) {}

  @IsPublic()
  @Get('list/public')
  listPublic(@Query() query: ProductAccountLoyaltyListDto) {
    return this.service.list(query);
  }
}
