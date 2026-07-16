import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { StockBatchAddDto } from './dtos/stock-batch.add.dto';

@Injectable()
export class StockBatchService {
  constructor(private readonly prisma: PrismaService) {}

  async add(dto: StockBatchAddDto) {
    const productFound = await this.prisma.product.findUnique({
      where: { id: dto.productId, deletedAt: null },
    });
    if (!productFound) {
      throw new NotFoundException('Producto no encontrado.');
    }
    if (productFound.disabledAt) {
      throw new NotFoundException(
        'Producto deshabilitado. Ative o produto antes de adicionar estoque.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.stockBatch.create({
        data: {
          productId: productFound.id,
          initialAmount: dto.amount,
          currentAmount: dto.amount,
          costPrice: dto.costPrice,
          supplierName: dto.supplierName,
        },
      });

      await tx.product.update({
        where: { id: productFound.id },
        data: { amount: { increment: dto.amount } },
      });
    });

    return { ok: true };
  }
}
