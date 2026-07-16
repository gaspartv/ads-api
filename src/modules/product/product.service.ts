import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ProductCreateDto } from './dtos/product.create.dto';
import { ProductEditDto } from './dtos/product.edit.dto';
import { generateCode } from 'src/functions/generate-code';
import { ProductListDto } from './dtos/product.list.dto';
import { ImageReorderDto } from './dtos/image.reorder.dto';
import { Prisma } from 'src/generated/prisma/client';
import { envConfig } from 'src/configs/env.config';
import type { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { pipeline } from 'stream';
import { v4 as uuidv4 } from 'uuid';

const pump = util.promisify(pipeline);

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCategoryId(pagination: ProductListDto) {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      disabledAt: null,
    };

    where.type = pagination.type;

    if (pagination.search) {
      where.OR = [
        {
          name: { contains: pagination.search, mode: 'insensitive' },
        },
        {
          description: { contains: pagination.search, mode: 'insensitive' },
        },
      ];
    }

    const orderBy = pagination.orderBy || 'createdAt';
    const orderType = pagination.orderType || 'asc';
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 25;

    const total = await this.prisma.product.count({ where });

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { [orderBy]: orderType },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        code: true,
        isFixed: true,
        featured: true,
        name: true,
        slug: true,
        description: true,
        metadata: true,
        price: true,
        promotionalPrice: true,
        amount: true,
        multiples: true,
        seoTitle: true,
        seoDescription: true,
        Images: {
          select: {
            id: true,
            url: true,
          },
          orderBy: { index: 'desc' },
        },
      },
    });

    return {
      data: products.map((product) => ({
        ...product,
        Images: product.Images.map((image) => ({
          ...image,
          url: envConfig.BACKEND_URL + image.url,
        })),
      })),
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async list(pagination: ProductListDto) {
    const where: Prisma.ProductWhereInput = { deletedAt: null };

    if (pagination.search) {
      where.OR = [
        {
          name: { contains: pagination.search, mode: 'insensitive' },
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

    if (pagination.type) {
      where.type = pagination.type;
    }

    if (pagination.featured) {
      where.featured = pagination.featured === 'true';
    }

    if (pagination.categoryId) {
      where.Categories = { some: { id: pagination.categoryId } };
    }

    const orderBy = pagination.orderBy || 'createdAt';
    const orderType = pagination.orderType || 'asc';
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 10;

    const total = await this.prisma.product.count({ where });

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { [orderBy]: orderType },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        code: true,
        createdAt: true,
        deletedAt: true,
        disabledAt: true,
        isFixed: true,
        featured: true,
        order: true,
        name: true,
        slug: true,
        description: true,
        metadata: true,
        price: true,
        promotionalPrice: true,
        amount: true,
        multiples: true,
        seoTitle: true,
        seoDescription: true,
        Images: {
          select: {
            id: true,
            url: true,
          },
          orderBy: { index: 'desc' },
        },
        Categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      data: products.map((product) => ({
        ...product,
        Images: product.Images.map((image) => ({
          ...image,
          url: envConfig.BACKEND_URL + image.url,
        })),
      })),
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: ProductCreateDto) {
    const categoriesCount = await this.prisma.category.count({
      where: { id: { in: dto.categoryIds } },
    });
    if (categoriesCount !== dto.categoryIds.length) {
      throw new ConflictException(
        'Uma ou mais categorias não foram encontradas.',
      );
    }

    const name = dto.name.trim();

    const exists = await this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        type: dto.type,
        name: { equals: name, mode: 'insensitive' },
      },
    });
    if (exists) {
      throw new ConflictException('Já existe um produto com este nome.');
    }

    let code: string;
    let codeExists: any;
    do {
      code = generateCode();
      codeExists = await this.prisma.product.findUnique({
        where: { code },
      });
    } while (codeExists);

    const lastProductIndex = await this.prisma.product.findMany({
      where: { Categories: { some: { id: { in: dto.categoryIds } } } },
      orderBy: { order: 'desc' },
      take: 1,
    });

    let order: number;
    if (lastProductIndex.length === 0) {
      order = 0;
    } else {
      order = lastProductIndex[0].order + 1;
    }

    let slug = name.split(' ').join('_').toLowerCase();
    let slugExists = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (slugExists) {
      slug = slug + '_' + generateCode();
    }

    await this.prisma.product.create({
      data: {
        type: dto.type,
        code,
        isFixed: dto.isFixed,
        featured: dto.featured,
        order,
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        slug,
        description: dto.description,
        metadata: dto.metadata,
        price: dto.price,
        promotionalPrice: dto.promotionalPrice,
        amount: dto.amount,
        multiples: dto.multiples,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        Categories: { connect: dto.categoryIds.map((id) => ({ id })) },
        StockBatches: {
          create: {
            costPrice: dto.costPrice,
            initialAmount: dto.amount,
            currentAmount: dto.amount,
            supplierName: dto.supplierName,
          },
        },
        Images: { create: {} },
      },
    });

    return { message: 'Produto cadastrado com sucesso.' };
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new ConflictException('Produto não encontrado.');

    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Produto deletado com sucesso.' };
  }

  async disable(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new ConflictException('Produto não encontrado.');

    await this.prisma.product.update({
      where: { id },
      data: { disabledAt: new Date() },
    });

    return { message: 'Produto desabilitado com sucesso.' };
  }

  async enable(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new ConflictException('Produto não encontrado.');

    await this.prisma.product.update({
      where: { id },
      data: { disabledAt: null },
    });

    return { message: 'Produto habilitado com sucesso.' };
  }

  async edit(id: string, dto: ProductEditDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new ConflictException('Produto não encontrado.');

    let name = product.name;
    if (dto.name) {
      name = dto.name.trim();
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

      if (name.toLowerCase() !== product.name.toLowerCase()) {
        const exists = await this.prisma.product.findFirst({
          where: {
            deletedAt: null,
            type: dto.type || product.type,
            name: { equals: name, mode: 'insensitive' },
            id: { not: id },
          },
        });
        if (exists)
          throw new ConflictException('Já existe um produto com este nome.');
      }
    }

    let slug = dto.slug || product.slug;
    if (
      dto.name &&
      !dto.slug &&
      name.toLowerCase() !== product.name.toLowerCase()
    ) {
      slug = name.split(' ').join('_').toLowerCase();
      let slugExists = await this.prisma.product.findUnique({
        where: { slug },
      });
      if (slugExists && slugExists.id !== id) {
        slug = slug + '_' + generateCode();
      }
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        type: dto.type,
        isFixed: dto.isFixed,
        featured: dto.featured,
        order: dto.order,
        name,
        slug,
        description: dto.description,
        metadata: dto.metadata,
        price: dto.price,
        promotionalPrice: dto.promotionalPrice,
        amount: dto.amount,
        multiples: dto.multiples,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        ...(dto.categoryIds && dto.categoryIds.length > 0
          ? {
              Categories: {
                set: [],
                connect: dto.categoryIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });

    return { message: 'Produto atualizado com sucesso.' };
  }

  async uploadImage(productId: string, req: FastifyRequest) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        Images: {
          take: 1,
          orderBy: { index: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
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

    const index = product.Images.length > 0 ? product.Images[0].index + 1 : 0;

    await this.prisma.image.create({
      data: {
        url: uploadedFileUrl,
        productId,
        index,
      },
    });

    return { message: 'Imagem do produto enviada com sucesso.' };
  }

  async deleteImage(productId: string, imageId: string) {
    const imageCount = await this.prisma.image.count({
      where: { productId },
    });

    if (imageCount === 1) {
      throw new UnprocessableEntityException(
        'Não é possível deletar a última imagem do produto.',
      );
    }

    const image = await this.prisma.image.findUnique({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new NotFoundException('Imagem não encontrada.');
    }

    const filename = image.url.split('/').pop();
    if (filename) {
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.prisma.image.delete({
      where: { id: imageId },
    });

    return { message: 'Imagem deletada com sucesso.' };
  }

  async reorderImages(productId: string, dto: ImageReorderDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado.');

    await this.prisma.$transaction(
      dto.imageIds.map((id, index) =>
        this.prisma.image.update({
          where: { id, productId },
          data: { index: index + 1000 },
        }),
      ),
    );

    const length = dto.imageIds.length;
    await this.prisma.$transaction(
      dto.imageIds.map((id, index) =>
        this.prisma.image.update({
          where: { id, productId },
          data: { index: length - index },
        }),
      ),
    );

    return { message: 'Imagens reordenadas com sucesso.' };
  }
}
