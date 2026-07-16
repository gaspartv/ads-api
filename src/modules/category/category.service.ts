import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import type { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { pipeline } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { CategoryCreateDto } from './dtos/category.create.dto';
import { generateCode } from 'src/functions/generate-code';
import { CategoryEditDto } from './dtos/category.edit.dto';
import { CategoryListDto } from './dtos/category.list.dto';
import { ImageReorderDto } from './dtos/image.reorder.dto';
import { Prisma } from 'src/generated/prisma/client';
import { envConfig } from 'src/configs/env.config';

const pump = util.promisify(pipeline);

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async listForHome() {
    const categories = await this.prisma.category.findMany({
      where: {
        deletedAt: null,
        disabledAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        Images: {
          orderBy: { index: 'asc' },
          take: 1,
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      Images: category.Images.map((image) => ({
        ...image,
        url: envConfig.BACKEND_URL + image.url,
      })),
    }));
  }

  async listProducts() {
    const categories = await this.prisma.category.findMany({
      where: {
        deletedAt: null,
        disabledAt: null,
      },
      select: {
        id: true,
        code: true,
        description: true,
        name: true,
        Images: {
          select: {
            id: true,
            url: true,
          },
          orderBy: { index: 'desc' },
          take: 1,
        },
        Products: {
          where: {
            deletedAt: null,
            disabledAt: null,
          },
          select: {
            id: true,
            code: true,
            amount: true,
            description: true,
            featured: true,
            isFixed: true,
            metadata: true,
            slug: true,
            type: true,
            name: true,
            seoTitle: true,
            seoDescription: true,
            price: true,
            promotionalPrice: true,
            Images: {
              select: {
                id: true,
                url: true,
              },
              orderBy: { index: 'desc' },
              take: 1,
            },
          },
          orderBy: { order: 'desc' },
          take: 4,
        },
      },
      orderBy: { name: 'desc' },
    });

    return categories.map((category) => ({
      ...category,
      Images: category.Images.map((image) => ({
        ...image,
        url: envConfig.BACKEND_URL + image.url,
      })),
      Products: category.Products.map((product) => ({
        ...product,
        Images: product.Images.map((image) => ({
          ...image,
          url: envConfig.BACKEND_URL + image.url,
        })),
      })),
    }));
  }

  async listForSelect() {
    return await this.prisma.category.findMany({
      where: { deletedAt: null, disabledAt: null },
      select: { id: true, name: true },
    });
  }

  async list(pagination: CategoryListDto) {
    const where: Prisma.CategoryWhereInput = { deletedAt: null };

    if (pagination.search) {
      where.OR = [
        { name: { contains: pagination.search, mode: 'insensitive' } },
        { description: { contains: pagination.search, mode: 'insensitive' } },
      ];
    }

    const orderBy = pagination.orderBy || 'createdAt';
    const orderType = pagination.orderType || 'asc';
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 10;

    const total = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { [orderBy]: orderType },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        deletedAt: true,
        disabledAt: true,
        code: true,
        name: true,
        description: true,
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
      data: categories.map((category) => ({
        ...category,
        Images: category.Images.map((image) => ({
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

  async create(dto: CategoryCreateDto) {
    const name = dto.name.trim();
    const description = dto.description?.trim();

    const categoryExists = await this.prisma.category.findFirst({
      where: { name, deletedAt: null },
    });
    if (categoryExists) {
      throw new NotFoundException('Categoria já cadastrada.');
    }

    await this.prisma.category.create({
      data: {
        code: generateCode(),
        name,
        description,
        Images: {
          create: {},
        },
      },
    });

    return { message: 'Categoria criada com sucesso.' };
  }

  async edit(categoryId: string, dto: CategoryEditDto) {
    const name = dto.name.trim();
    const description = dto.description ? dto.description.trim() : null;

    const categoryFound = await this.prisma.category.findUnique({
      where: { id: categoryId, deletedAt: null },
    });
    if (!categoryFound) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const categoryExists = await this.prisma.category.findFirst({
      where: { name, deletedAt: null },
    });
    if (categoryExists && categoryExists.id !== categoryId) {
      throw new ConflictException('Categoria já cadastrada.');
    }

    await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description,
      },
    });

    return { message: 'Categoria atualizada com sucesso.' };
  }

  async delete(categoryId: string) {
    const categoryFound = await this.prisma.category.findUnique({
      where: { id: categoryId, deletedAt: null },
    });
    if (!categoryFound) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.prisma.category.update({
      where: { id: categoryId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Categoria deletada com sucesso.' };
  }

  async disable(categoryId: string) {
    const categoryFound = await this.prisma.category.findUnique({
      where: { id: categoryId, deletedAt: null },
    });
    if (!categoryFound) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.prisma.category.update({
      where: { id: categoryId },
      data: { disabledAt: new Date() },
    });

    return { message: 'Categoria desabilitada com sucesso.' };
  }

  async enable(categoryId: string) {
    const categoryFound = await this.prisma.category.findUnique({
      where: { id: categoryId, deletedAt: null },
    });
    if (!categoryFound) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.prisma.category.update({
      where: { id: categoryId },
      data: { disabledAt: null },
    });

    return { message: 'Categoria habilitada com sucesso.' };
  }

  async uploadImage(categoryId: string, req: FastifyRequest) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        Images: {
          take: 1,
          orderBy: { index: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
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

    const index = category.Images.length > 0 ? category.Images[0].index + 1 : 0;

    await this.prisma.image.create({
      data: {
        url: uploadedFileUrl,
        categoryId,
        index,
      },
    });

    return { message: 'Imagem da categoria enviada com sucesso.' };
  }

  async deleteImage(categoryId: string, imageId: string) {
    const imageCount = await this.prisma.image.count({
      where: { categoryId },
    });

    if (imageCount === 1) {
      throw new UnprocessableEntityException(
        'Não é possível deletar a última imagem da categoria.',
      );
    }

    const image = await this.prisma.image.findUnique({
      where: { id: imageId, categoryId },
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

  async reorderImages(categoryId: string, dto: ImageReorderDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada.');

    await this.prisma.$transaction(
      dto.imageIds.map((id, index) =>
        this.prisma.image.update({
          where: { id, categoryId },
          data: { index: index + 1000 },
        }),
      ),
    );

    const length = dto.imageIds.length;
    await this.prisma.$transaction(
      dto.imageIds.map((id, index) =>
        this.prisma.image.update({
          where: { id, categoryId },
          data: { index: length - index },
        }),
      ),
    );

    return { message: 'Imagens reordenadas com sucesso.' };
  }
}
