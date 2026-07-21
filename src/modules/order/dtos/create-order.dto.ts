import { Type } from 'class-transformer';
import { IsString, IsEnum, IsArray, ValidateNested, IsOptional, IsInt, IsObject } from 'class-validator';
import { Currency, PaymentMethod, ProductType } from 'src/generated/prisma/enums';

export class OrderItemDto {
  @IsEnum(ProductType)
  productType: ProductType;

  @IsString()
  @IsOptional()
  productId?: string; // ID do produto (char, coins ou loyalty) dependendo do type

  @IsInt()
  quantity: number;

  @IsInt()
  @IsOptional()
  overridePrice?: number; // Preço sobrescrito pelo atendente

  @IsInt()
  @IsOptional()
  overrideCostPrice?: number; // Custo sobrescrito
}

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsString()
  companyId: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsObject()
  @IsOptional()
  paymentDetails?: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsInt()
  @IsOptional()
  discountAmount?: number;

  @IsInt()
  @IsOptional()
  feeAmount?: number;

  @IsInt()
  @IsOptional()
  shippingAmount?: number;
}
