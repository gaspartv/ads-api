import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['items', 'customerId', 'companyId'] as const)
) {}
