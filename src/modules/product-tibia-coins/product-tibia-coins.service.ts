import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { ProductTibiaCoinsVariableDto } from './dtos/variables/variables.create.dto';
import { ProductTibiaCoinsVariableUpdateDto } from './dtos/variables/variables.update.dto';
import { envConfig } from 'src/configs/env.config';

@Injectable()
export class ProductTibiaCoinsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic() {
    const productTibiaCoins = await this.prisma.productTibiaCoins.findMany({
      include: {
        Variables: {
          where: { disabledAt: null },
          orderBy: { min: 'asc' },
        },
      },
    });

    return productTibiaCoins.map((ptc) => ({
      ...ptc,
      Variables: ptc.Variables.map((variable) => ({
        ...variable,
        price: 10 * variable.price,
        url: envConfig.BACKEND_URL + variable.url,
      })),
    }));
  }

  async list() {
    return await this.prisma.productTibiaCoins.findMany();
  }

  async createVariable(dto: ProductTibiaCoinsVariableDto) {
    const productTibiaCoins = await this.prisma.productTibiaCoins.findFirst();
    if (!productTibiaCoins) {
      throw new BadRequestException('Produto Tibia Coins não encontrado');
    }

    // Verifica se já existe algum range que se sobreponha ao novo
    const overlapping = await this.prisma.productTibiaCoinsVariable.findFirst({
      where: {
        min: { lte: dto.max },
        max: { gte: dto.min },
      },
    });

    if (overlapping) {
      throw new BadRequestException('Range já existente ou sobreposto');
    }

    // Busca o range imediatamente inferior (que termina antes de min)
    const lowerRange = await this.prisma.productTibiaCoinsVariable.findFirst({
      where: { max: { lt: dto.min } },
      orderBy: { max: 'desc' },
    });

    if (lowerRange && dto.price <= lowerRange.price) {
      throw new BadRequestException(
        `O preço deve ser maior que o do range anterior (${lowerRange.min} a ${lowerRange.max} - Preço: ${lowerRange.price})`,
      );
    }

    // Busca o range imediatamente superior (que começa depois de max)
    const higherRange = await this.prisma.productTibiaCoinsVariable.findFirst({
      where: { min: { gt: dto.max } },
      orderBy: { min: 'asc' },
    });

    if (higherRange && dto.price >= higherRange.price) {
      throw new BadRequestException(
        `O preço deve ser menor que o do próximo range (${higherRange.min} a ${higherRange.max} - Preço: ${higherRange.price})`,
      );
    }

    await this.prisma.productTibiaCoinsVariable.create({
      data: {
        price: dto.price,
        promotionalPrice: dto.promotionalPrice,
        min: dto.min,
        max: dto.max,
        url: dto.url,
        description: dto.description,
        productTibiaCoinsId: productTibiaCoins.id,
      },
    });
  }

  async updateVariable(id: string, dto: ProductTibiaCoinsVariableUpdateDto) {
    const existingVar = await this.prisma.productTibiaCoinsVariable.findUnique({
      where: { id },
    });

    if (!existingVar) {
      throw new BadRequestException('Variável não encontrada');
    }

    const min = dto.min !== undefined ? dto.min : existingVar.min;
    const max = dto.max !== undefined ? dto.max : existingVar.max;
    const price = dto.price !== undefined ? dto.price : existingVar.price;

    if (min !== null && max !== null) {
      // Verifica se já existe algum range que se sobreponha ao novo
      const overlapping = await this.prisma.productTibiaCoinsVariable.findFirst(
        {
          where: {
            min: { lte: max },
            max: { gte: min },
            id: { not: id }, // Exclui a variável atual da busca
          },
        },
      );

      if (overlapping) {
        throw new BadRequestException('Range já existente ou sobreposto');
      }

      // Busca o range imediatamente inferior (que termina antes de min)
      const lowerRange = await this.prisma.productTibiaCoinsVariable.findFirst({
        where: { max: { lt: min }, id: { not: id } },
        orderBy: { max: 'desc' },
      });

      if (lowerRange && price <= lowerRange.price) {
        throw new BadRequestException(
          `O preço deve ser maior que o do range anterior (${lowerRange.min} a ${lowerRange.max} - Preço: ${lowerRange.price})`,
        );
      }

      // Busca o range imediatamente superior (que começa depois de max)
      const higherRange = await this.prisma.productTibiaCoinsVariable.findFirst(
        {
          where: { min: { gt: max }, id: { not: id } },
          orderBy: { min: 'asc' },
        },
      );

      if (higherRange && price >= higherRange.price) {
        throw new BadRequestException(
          `O preço deve ser menor que o do próximo range (${higherRange.min} a ${higherRange.max} - Preço: ${higherRange.price})`,
        );
      }
    }

    await this.prisma.productTibiaCoinsVariable.update({
      where: { id },
      data: {
        price: dto.price,
        promotionalPrice: dto.promotionalPrice,
        min: dto.min,
        max: dto.max,
        url: dto.url,
        description: dto.description,
      },
    });
  }
}
