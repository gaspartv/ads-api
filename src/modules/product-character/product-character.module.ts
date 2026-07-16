import { Module } from '@nestjs/common';
import { ProductCharacterController } from './product-character.controller';
import { ProductCharacterService } from './product-character.service';

@Module({
  controllers: [ProductCharacterController],
  providers: [ProductCharacterService],
})
export class ProductCharacterModule {}
