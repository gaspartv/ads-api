import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { OrderListDto } from './dtos/order.list.dto';
import { generateCode } from 'src/functions/generate-code';
import { Currency, OrderStatus, ProductType } from 'src/generated/prisma/enums';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderDto, createdById?: string) {
    const { items, ...orderData } = data;

    // Validate Customer and Company
    const customer = await this.prisma.customer.findUnique({
      where: { id: orderData.customerId },
    });
    if (!customer) throw new NotFoundException('Cliente não cadastrado.');

    const company = await this.prisma.company.findUnique({
      where: { id: orderData.companyId },
    });
    if (!company) throw new NotFoundException('Empresa não encontrada.');

    let subtotalAmount = 0;
    let subtotalCoins = 0;
    let totalCostAmount = 0;

    const orderItemsData: any[] = [];

    for (const item of items) {
      let unitPrice = 0;
      let unitPriceCoins = 0;
      let unitCostPrice = 0;
      let productSnapshot = {};

      if (item.productType === ProductType.CHARACTER && item.productId) {
        const char = await this.prisma.productCharacter.findUnique({
          where: { id: item.productId },
        });
        if (!char)
          throw new NotFoundException(`Character ${item.productId} not found`);

        unitPrice =
          item.overridePrice !== undefined
            ? item.overridePrice
            : char.promotionalPrice || char.price;
        unitPriceCoins =
          item.overridePrice !== undefined
            ? item.overridePrice
            : char.promotionalPriceTibiaCoins || char.priceTibiaCoins || 0;
        unitCostPrice =
          item.overrideCostPrice !== undefined
            ? item.overrideCostPrice
            : char.costPrice;

        productSnapshot = {
          title: char.title,
          level: char.level,
          vocation: char.vocation,
        };

        // Dar baixa no produto
        await this.prisma.productCharacter.update({
          where: { id: char.id },
          data: { soldAt: new Date() },
        });
      } else if (
        item.productType === ProductType.ACCOUNT_LOYALTY &&
        item.productId
      ) {
        const acc = await this.prisma.productAccountLoyalty.findUnique({
          where: { id: item.productId },
        });
        if (!acc)
          throw new NotFoundException(
            `Account Loyalty ${item.productId} not found`,
          );

        unitPrice =
          item.overridePrice !== undefined
            ? item.overridePrice
            : acc.promotionalPrice || acc.price;
        unitPriceCoins =
          item.overridePrice !== undefined
            ? item.overridePrice
            : acc.promotionalPriceTibiaCoins || acc.priceTibiaCoins;
        unitCostPrice =
          item.overrideCostPrice !== undefined
            ? item.overrideCostPrice
            : acc.costPrice;

        productSnapshot = {
          title: acc.title,
          points: acc.points,
          percentage: acc.percentage,
        };

        // Dar baixa no produto
        await this.prisma.productAccountLoyalty.update({
          where: { id: acc.id },
          data: { soldAt: new Date() },
        });
      } else if (
        item.productType === ProductType.TIBIA_COINS &&
        item.productId
      ) {
        if (item.quantity % 25 !== 0) {
          throw new BadRequestException(
            'A quantidade de Tibia Coins deve ser múltipla de 25.',
          );
        }
        const packsNeeded = item.quantity / 25;

        const tc = await this.prisma.productTibiaCoins.findUnique({
          where: { id: item.productId },
          include: {
            StockBatches: {
              where: { currentAmount: { gt: 0 } },
              orderBy: { createdAt: 'asc' },
            },
          },
        });
        if (!tc)
          throw new NotFoundException(
            `Tibia Coins ${item.productId} not found`,
          );

        if (tc.amount < packsNeeded) {
          throw new BadRequestException(
            `Estoque insuficiente de Tibia Coins (Disponível: ${tc.amount * 25}, Solicitado: ${item.quantity})`,
          );
        }

        let packsRemaining = packsNeeded;
        let totalBatchCost = 0;
        const batchesToUpdate: { id: string; currentAmount: number }[] = [];

        for (const batch of tc.StockBatches) {
          if (packsRemaining <= 0) break;
          const take = Math.min(batch.currentAmount, packsRemaining);
          packsRemaining -= take;
          totalBatchCost += take * batch.costPrice;
          batchesToUpdate.push({
            id: batch.id,
            currentAmount: batch.currentAmount - take,
          });
        }

        // Atualizar os batches e o amount principal
        for (const b of batchesToUpdate) {
          await this.prisma.productTibiaCoinsStockBatch.update({
            where: { id: b.id },
            data: { currentAmount: b.currentAmount },
          });
        }
        await this.prisma.productTibiaCoins.update({
          where: { id: tc.id },
          data: { amount: tc.amount - packsNeeded },
        });

        unitPrice = item.overridePrice !== undefined ? item.overridePrice : 0;
        // Calcula o custo unitário (por 1 TC) para que a multiplicação (unitCostPrice * quantity) resulte no custo total real dos pacotes.
        unitCostPrice = totalBatchCost / item.quantity;

        productSnapshot = { name: tc.name, amount: tc.amount };
      }

      const itemTotal = unitPrice * item.quantity;
      const itemTotalCoins = unitPriceCoins * item.quantity;
      const itemTotalCost = unitCostPrice * item.quantity;

      subtotalAmount += itemTotal;
      subtotalCoins += itemTotalCoins;
      totalCostAmount += itemTotalCost;

      orderItemsData.push({
        productType: item.productType,
        quantity: item.quantity,
        unitPrice,
        unitPriceCoins,
        unitCostPrice,
        productSnapshot,
        productCharacterId:
          item.productType === ProductType.CHARACTER ? item.productId : null,
        productAccountLoyaltyId:
          item.productType === ProductType.ACCOUNT_LOYALTY
            ? item.productId
            : null,
        productTibiaCoinsId:
          item.productType === ProductType.TIBIA_COINS ? item.productId : null,
      });
    }

    const isBrl = orderData.currency === Currency.BRL;

    // Apply adjustments
    const discount = orderData.discountAmount || 0;
    const fee = orderData.feeAmount || 0;
    const shipping = orderData.shippingAmount || 0;

    let totalAmount: number | null = null;
    let totalTibiaCoins: number | null = null;

    if (isBrl) {
      totalAmount = subtotalAmount - discount + fee + shipping;
    } else {
      totalTibiaCoins = subtotalCoins - discount + fee + shipping;
    }

    // Profit is based on BRL usually. If selling in TC, the profit formula might differ, but assuming BRL here:
    // Profit = (Total Received) - (Total Cost)
    // If it's TC, we might need a conversion rate, but for now we follow the simple BRL calculation if it's BRL.
    const profitAmount =
      isBrl && totalAmount !== null ? totalAmount - totalCostAmount : null;

    return this.prisma.order.create({
      data: {
        code: generateCode(),
        ...orderData,
        subtotalAmount: isBrl ? subtotalAmount : null,
        totalAmount,
        totalTibiaCoins,
        totalCostAmount,
        profitAmount,
        createdById,
        Items: {
          create: orderItemsData,
        },
      },
      include: {
        Items: true,
      },
    });
  }

  async findAll(params: OrderListDto) {
    const {
      status,
      customerId,
      page = 1,
      limit = 20,
      orderBy = 'createdAt',
      orderType = 'desc',
    } = params;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      ...(status && { status }),
      ...(customerId && { customerId }),
    };

    const total = await this.prisma.order.count({ where });

    const orders = await this.prisma.order.findMany({
      skip,
      take,
      where,
      include: {
        Customer: true,
        _count: {
          select: { Items: true },
        },
      },
      orderBy: { [orderBy]: orderType },
    });

    return {
      data: orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        Customer: true,
        Company: true,
        Items: true,
        CreatedBy: { select: { id: true, firstName: true, email: true } },
        UpdatedBy: { select: { id: true, firstName: true, email: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(
    id: string,
    updateData: UpdateOrderStatusDto,
    updatedById?: string,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const updatePayload: any = { status: updateData.status, updatedById };

    if (
      updateData.status === OrderStatus.PROCESSING &&
      order.status !== OrderStatus.PROCESSING
    ) {
      updatePayload.paidAt = new Date();
    } else if (
      updateData.status === OrderStatus.COMPLETED &&
      order.status !== OrderStatus.COMPLETED
    ) {
      updatePayload.completedAt = new Date();
    } else if (
      updateData.status === OrderStatus.CANCELED &&
      order.status !== OrderStatus.CANCELED
    ) {
      updatePayload.canceledAt = new Date();
    } else if (
      updateData.status === OrderStatus.REFUNDED &&
      order.status !== OrderStatus.REFUNDED
    ) {
      updatePayload.refundedAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updatePayload,
    });
  }

  async update(id: string, updateData: UpdateOrderDto, updatedById?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        updatedById,
      },
    });
  }
}
