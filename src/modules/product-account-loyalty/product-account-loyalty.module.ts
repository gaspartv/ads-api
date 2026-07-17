import { Module } from '@nestjs/common';
import { ProductAccountLoyaltyController } from './product-account-loyalty.controller';
import { ProductAccountLoyaltyService } from './product-account-loyalty.service';

@Module({
  controllers: [ProductAccountLoyaltyController],
  providers: [ProductAccountLoyaltyService],
})
export class ProductAccountLoyaltyModule {}
