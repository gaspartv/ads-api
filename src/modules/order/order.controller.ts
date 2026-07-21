import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { OrderListDto } from './dtos/order.list.dto';
import { UserSign } from 'src/common/decorators/user.decorator';
import type { User } from 'src/generated/prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @IsAdminOnly()
  @Post()
  create(@Body() body: CreateOrderDto, @UserSign() user: User) {
    return this.orderService.create(body, user.id);
  }

  @IsAdminOnly()
  @Get('list')
  findAll(@Query() query: OrderListDto) {
    return this.orderService.findAll(query);
  }

  @IsAdminOnly()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @IsAdminOnly()
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
    @UserSign() user: User,
  ) {
    return this.orderService.updateStatus(id, body, user.id);
  }

  @IsAdminOnly()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateOrderDto,
    @UserSign() user: User,
  ) {
    return this.orderService.update(id, body, user.id);
  }
}
