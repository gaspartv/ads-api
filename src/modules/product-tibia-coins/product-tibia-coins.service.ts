import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { Prisma, ProductTibiaCoinsType } from 'src/generated/prisma/client';
import { ProductTibiaCoinsVariableDto } from './dtos/variables/variables.create.dto';
import { ProductTibiaCoinsVariableUpdateDto } from './dtos/variables/variables.update.dto';
import { envConfig } from 'src/configs/env.config';
import { ProductTibiaCoinsEditDto } from './dtos/product-tibia-coins.edit.dto';
import { StockBatchCreateDto } from './dtos/stock-batch/stock-batch.create.dto';
import type { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { pipeline } from 'stream';
import { v4 as uuidv4 } from 'uuid';

const pump = util.promisify(pipeline);

@Injectable()
export class ProductTibiaCoinsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(type: ProductTibiaCoinsType) {
    const productTibiaCoins = await this.prisma.productTibiaCoins.findMany({
      where: {
        type,
        disabledAt: null,
      },
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
    return await this.prisma.productTibiaCoins.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async editProductTibiaCoins(id: string, dto: ProductTibiaCoinsEditDto) {
    const productTibiaCoins = await this.prisma.productTibiaCoins.findUnique({
      where: { id },
    });
    if (!productTibiaCoins) {
      throw new BadRequestException('Produto Tibia Coins não encontrado');
    }
    await this.prisma.productTibiaCoins.update({
      where: { id },
      data: {
        description: dto.description,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
    });

    return { message: 'Produto Tibia Coins editado com sucesso.' };
  }

  async enable(id: string) {
    const productTibiaCoins = await this.prisma.productTibiaCoins.findUnique({
      where: { id },
    });
    if (!productTibiaCoins) {
      throw new BadRequestException('Produto Tibia Coins não encontrado');
    }

    await this.prisma.productTibiaCoins.update({
      where: { id },
      data: {
        disabledAt: null,
      },
    });

    return { message: 'Produto Tibia Coins habilitado com sucesso.' };
  }

  async disable(id: string) {
    const productTibiaCoins = await this.prisma.productTibiaCoins.findUnique({
      where: { id },
    });
    if (!productTibiaCoins) {
      throw new BadRequestException('Produto Tibia Coins não encontrado');
    }

    await this.prisma.productTibiaCoins.update({
      where: { id },
      data: {
        disabledAt: new Date(),
      },
    });

    return { message: 'Produto Tibia Coins desabilitado com sucesso.' };
  }

  async listVariables() {
    return await this.prisma.productTibiaCoinsVariable.findMany();
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

  async enableVariable(id: string) {
    const variable = await this.prisma.productTibiaCoinsVariable.findUnique({
      where: { id },
    });
    if (!variable) {
      throw new BadRequestException('Variável não encontrada');
    }
    await this.prisma.productTibiaCoinsVariable.update({
      where: { id },
      data: { disabledAt: null },
    });

    return { message: 'Variável habilitada com sucesso.' };
  }

  async disableVariable(id: string) {
    const variable = await this.prisma.productTibiaCoinsVariable.findUnique({
      where: { id },
    });
    if (!variable) {
      throw new BadRequestException('Variável não encontrada');
    }
    await this.prisma.productTibiaCoinsVariable.update({
      where: { id },
      data: { disabledAt: new Date() },
    });

    return { message: 'Variável desabilitada com sucesso.' };
  }

  async deleteVariable(id: string) {
    const variable = await this.prisma.productTibiaCoinsVariable.findUnique({
      where: { id },
    });
    if (!variable) {
      throw new BadRequestException('Variável não encontrada');
    }
    await this.prisma.productTibiaCoinsVariable.delete({
      where: { id },
    });

    return { message: 'Variável deletada com sucesso.' };
  }

  async stockBatchCreate(dto: StockBatchCreateDto) {
    const productTibiaCoins = await this.prisma.productTibiaCoins.findUnique({
      where: { id: dto.productTibiaCoinsId },
    });
    if (!productTibiaCoins) {
      throw new BadRequestException('Produto Tibia Coins não encontrado');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.productTibiaCoinsStockBatch.create({
        data: {
          initialAmount: dto.initialAmount,
          currentAmount: dto.initialAmount,
          costPrice: dto.costPrice,
          supplierName: dto.supplierName,
          productTibiaCoinsId: dto.productTibiaCoinsId,
        },
      });

      await tx.productTibiaCoins.update({
        where: { id: dto.productTibiaCoinsId },
        data: { amount: { increment: dto.initialAmount } },
      });
    });
  }

  async uploadImage(variableId: string, req: FastifyRequest) {
    const variable = await this.prisma.productTibiaCoinsVariable.findUnique({
      where: { id: variableId },
    });

    if (!variable) {
      throw new NotFoundException('Variável não encontrada.');
    }

    const data = await req.file();
    if (!data) {
      throw new NotFoundException('Arquivo não enviado.');
    }

    const ext = path.extname(data.filename) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    await pump(data.file, fs.createWriteStream(filePath));

    const uploadedFileUrl = `/uploads/${filename}`;

    await this.prisma.productTibiaCoinsVariable.update({
      where: { id: variableId },
      data: { url: uploadedFileUrl },
    });

    if (variable.url && variable.url.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), variable.url.replace(/^\//, ''));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    return { message: 'Imagem enviada com sucesso.', imageUrl: uploadedFileUrl };
  }
}
