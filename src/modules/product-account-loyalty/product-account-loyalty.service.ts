import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ProductAccountLoyaltyListDto } from './dtos/product-account-loyalty.list.dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ProductAccountLoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  async list(pagination: ProductAccountLoyaltyListDto) {
    const where: Prisma.ProductAccountLoyaltyWhereInput = { deletedAt: null };

    if (pagination.search) {
      where.OR = [
        {
          title: { contains: pagination.search, mode: 'insensitive' },
        },
        {
          description: { contains: pagination.search, mode: 'insensitive' },
        },
      ];
    }

    if (pagination.status === 'ativo') {
      where.disabledAt = null;
    } else if (pagination.status === 'inativo') {
      where.disabledAt = { not: null };
    }

    const orderBy = pagination.orderBy || 'createdAt';
    const orderType = pagination.orderType || 'desc';
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 10;

    const total = await this.prisma.productAccountLoyalty.count({ where });

    const accounts = await this.prisma.productAccountLoyalty.findMany({
      where,
      orderBy: { [orderBy]: orderType },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: accounts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
