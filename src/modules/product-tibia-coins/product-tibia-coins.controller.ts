import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductTibiaCoinsService } from './product-tibia-coins.service';
import { ProductTibiaCoinsVariableDto } from './dtos/variables/variables.create.dto';
import { ProductTibiaCoinsVariableUpdateDto } from './dtos/variables/variables.update.dto';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

@Controller('product-tibia-coins')
export class ProductTibiaCoinsController {
  constructor(private readonly service: ProductTibiaCoinsService) {}

  @IsPublic()
  @Get('list/public')
  listPublic() {
    return this.service.listPublic();
  }

  @IsAdminOnly()
  @Get('list')
  list() {
    return this.service.list();
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
}
