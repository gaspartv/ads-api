import { Module } from '@nestjs/common';
import { ProductTibiaCoinsController } from './product-tibia-coins.controller';
import { ProductTibiaCoinsService } from './product-tibia-coins.service';

@Module({
  controllers: [ProductTibiaCoinsController],
  providers: [ProductTibiaCoinsService],
})
export class ProductTibiaCoinsModule {}
