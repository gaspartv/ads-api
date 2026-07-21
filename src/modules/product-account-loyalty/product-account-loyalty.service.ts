import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ProductAccountLoyaltyListDto } from './dtos/product-account-loyalty.list.dto';
import { Prisma } from 'src/generated/prisma/client';
import { ProductAccountLoyaltyCreateDto } from './dtos/product-account-loyalty.create.dto';
import { generateCode } from 'src/functions/generate-code';
import { ProductAccountLoyaltyEditDto } from './dtos/product-account-loyalty.edit.dto';

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

  async create(dto: ProductAccountLoyaltyCreateDto, companyId: string) {
    let code: string;
    let codeExists: any;
    do {
      code = generateCode();
      codeExists = await this.prisma.productCharacter.findFirst({
        where: { code, companyId },
      });
    } while (codeExists);

    await this.prisma.productAccountLoyalty.create({
      data: {
        columns: {},
        companyId,
        code,
        title: dto.title,
        description: dto.description,
        points: dto.points,
        percentage: dto.percentage,
        price: dto.price,
        promotionalPrice: dto.promotionalPrice,
        priceTibiaCoins: dto.priceTibiaCoins,
        promotionalPriceTibiaCoins: dto.promotionalPriceTibiaCoins,
        safeAddress: dto.safeAddress === 'true',
        hasRecoveryKey: dto.hasRecoveryKey === 'true',
        metadata: dto.metadata,
      },
    });

    return { message: 'Conta de loyalty cadastrada com sucesso.' };
  }

  async edit(
    productAccountLoyaltyId: string,
    dto: ProductAccountLoyaltyEditDto,
  ) {
    const accLoyalty = await this.prisma.productAccountLoyalty.findUnique({
      where: { id: productAccountLoyaltyId, deletedAt: null },
    });
    if (!accLoyalty) {
      throw new Error('Conta de loyalty não encontrada.');
    }

    await this.prisma.productAccountLoyalty.update({
      where: { id: productAccountLoyaltyId },
      data: {
        title: dto.title,
        description: dto.description,
        points: dto.points,
        percentage: dto.percentage,
        price: dto.price,
        promotionalPrice: dto.promotionalPrice,
        priceTibiaCoins: dto.priceTibiaCoins,
        promotionalPriceTibiaCoins: dto.promotionalPriceTibiaCoins,
        safeAddress: dto.safeAddress === 'true',
        hasRecoveryKey: dto.hasRecoveryKey === 'true',
        metadata: dto.metadata,
      },
    });

    return { message: 'Conta de loyalty editada com sucesso.' };
  }

  async delete(productAccountLoyaltyId: string) {
    const accLoyalty = await this.prisma.productAccountLoyalty.findUnique({
      where: { id: productAccountLoyaltyId, deletedAt: null },
    });
    if (!accLoyalty) {
      throw new Error('Conta de loyalty não encontrada.');
    }

    await this.prisma.productAccountLoyalty.update({
      where: { id: productAccountLoyaltyId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Conta de loyalty deletada com sucesso.' };
  }

  async disable(productAccountLoyaltyId: string) {
    const accLoyalty = await this.prisma.productAccountLoyalty.findUnique({
      where: { id: productAccountLoyaltyId, deletedAt: null },
    });
    if (!accLoyalty) {
      throw new Error('Conta de loyalty não encontrada.');
    }

    await this.prisma.productAccountLoyalty.update({
      where: { id: productAccountLoyaltyId },
      data: { disabledAt: new Date() },
    });

    return { message: 'Conta de loyalty desabilitada com sucesso.' };
  }

  async enable(productAccountLoyaltyId: string) {
    const accLoyalty = await this.prisma.productAccountLoyalty.findUnique({
      where: { id: productAccountLoyaltyId, deletedAt: null },
    });
    if (!accLoyalty) {
      throw new Error('Conta de loyalty não encontrada.');
    }

    await this.prisma.productAccountLoyalty.update({
      where: { id: productAccountLoyaltyId },
      data: { disabledAt: null },
    });

    return { message: 'Conta de loyalty habilitada com sucesso.' };
  }
}
