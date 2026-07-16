import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class StockBatchAddDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  costPrice: number;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
