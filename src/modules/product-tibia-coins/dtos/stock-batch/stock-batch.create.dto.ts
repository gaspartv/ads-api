import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class StockBatchCreateDto {
  @IsNumber()
  @IsNotEmpty()
  initialAmount: number;

  @IsNumber()
  @IsNotEmpty()
  costPrice: number;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsString()
  @IsNotEmpty()
  productTibiaCoinsId: string;
}
