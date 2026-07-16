import { Module } from '@nestjs/common';
import { StockBatchController } from './stock-batch.controller';
import { StockBatchService } from './stock-batch.service';

@Module({
  controllers: [StockBatchController],
  providers: [StockBatchService],
})
export class StockBatchModule {}
