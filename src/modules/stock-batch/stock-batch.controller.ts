import { Body, Controller, Post } from '@nestjs/common';
import { StockBatchService } from './stock-batch.service';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { StockBatchAddDto } from './dtos/stock-batch.add.dto';

@Controller('stock-batch')
export class StockBatchController {
  constructor(private readonly service: StockBatchService) {}

  @IsAdminOnly()
  @Post('add')
  add(@Body() body: StockBatchAddDto) {
    return this.service.add(body);
  }
}
