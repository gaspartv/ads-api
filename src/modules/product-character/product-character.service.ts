import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ProductCharacterCreateDto } from './dtos/product-character.create.dto';
import { ProductCharacterListDto } from './dtos/product-character.list.dto';
import { ProductCharacterEditDto } from './dtos/product-character.edit.dto';
import { ProductCharacterReorderDto } from './dtos/product-character.reorder.dto';
import { ImageReorderDto } from '../product/dtos/image.reorder.dto';
import { generateCode } from 'src/functions/generate-code';
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
export class ProductCharacterService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(slug: string) {
    const character = await this.prisma.productCharacter.findUnique({
      where: { slug },
      include: {
        Images: {
          select: {
            id: true,
            url: true,
          },
          orderBy: { index: 'desc' },
        },
        World: true,
        Charms: true,
        Mounts: true,
        Outfits: {
          include: {
            Outfit: {
              include: {
                Genders: true,
              },
            },
          },
        },
      },
    });

    return {
      ...character,
      Images: character?.Images.map((image) => ({
        ...image,
        url: envConfig.BACKEND_URL + image.url,
      })),
      Charms: character?.Charms.map((charm) => ({
        ...charm,
        image: envConfig.BACKEND_URL + charm.image,
      })),
      Mounts: character?.Mounts.map((mount) => ({
        ...mount,
        image: envConfig.BACKEND_URL + mount.image,
      })),
      Outfits: character?.Outfits.map((mapOutfit) => {
        const outfitGenders = mapOutfit.Outfit.Genders;
        const charGender = character.gender; // "MALE" or "FEMALE"
        const genderMatch = outfitGenders.find((g) => g.gender === charGender);

        let imageUrl: string | null = null;
        if (genderMatch) {
          if (mapOutfit.nivel === 'FULL' && genderMatch.full)
            imageUrl = genderMatch.full;
          else if (mapOutfit.nivel === 'ADDON_TWO' && genderMatch.addonTwo)
            imageUrl = genderMatch.addonTwo;
          else if (mapOutfit.nivel === 'ADDON_ONE' && genderMatch.addonOne)
            imageUrl = genderMatch.addonOne;
          else imageUrl = genderMatch.outfit;
        }

        return {
          ...mapOutfit,
          Outfit: {
            ...mapOutfit.Outfit,
            imageUrl: imageUrl ? envConfig.BACKEND_URL + imageUrl : null,
          },
        };
      }),
    };
  }

  async list(pagination: ProductCharacterListDto) {
    const where: Prisma.ProductCharacterWhereInput = { deletedAt: null };

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

    if (pagination.featured) {
      where.isFeatured = pagination.featured === 'true';
    }

    const orderBy = pagination.orderBy || 'order';
    const orderType = pagination.orderType || 'asc';
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 10;

    const total = await this.prisma.productCharacter.count({ where });

    const characters = await this.prisma.productCharacter.findMany({
      where,
      orderBy: { [orderBy]: orderType },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        Images: {
          select: {
            id: true,
            url: true,
          },
          orderBy: { index: 'desc' },
        },
        World: true,
        Charms: true,
        Mounts: true,
        Outfits: {
          include: {
            Outfit: true,
          },
        },
      },
    });

    return {
      data: characters.map((character) => ({
        ...character,
        Images: character.Images.map((image) => ({
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

  async create(dto: ProductCharacterCreateDto) {
    let code: string;
    let codeExists: any;
    do {
      code = generateCode();
      codeExists = await this.prisma.productCharacter.findUnique({
        where: { code },
      });
    } while (codeExists);

    let slug: string;
    let slugExists: any;
    do {
      slug = dto.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 200);
      slugExists = await this.prisma.productCharacter.findFirst({
        where: {
          deletedAt: null,
          slug,
        },
      });
    } while (slugExists);

    const productOrder = await this.prisma.productCharacter.findFirst({
      where: { deletedAt: null },
      orderBy: { order: 'desc' },
      take: 1,
      select: { order: true },
    });

    const order = productOrder ? productOrder.order + 1 : 1;

    await this.prisma.$transaction(async (tx) => {
      const productCharacter = await tx.productCharacter.create({
        data: {
          code,
          slug,
          order,
          isFeatured: dto.isFeatured === 'true',
          title: dto.title,
          description: dto.description,
          price: dto.price,
          promotionalPrice: dto.promotionalPrice,
          priceTibiaCoins: dto.priceTibiaCoins,
          promotionalPriceTibiaCoins: dto.promotionalPriceTibiaCoins,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          vocation: dto.vocation,
          level: dto.level,
          gender: dto.gender,
          loyalty: dto.loyalty,
          worldId: dto.worldId,
          magicLevel: dto.magicLevel,
          fistFighting: dto.fistFighting,
          swordFighting: dto.swordFighting,
          axeFighting: dto.axeFighting,
          clubFighting: dto.clubFighting,
          distanceFighting: dto.distanceFighting,
          shielding: dto.shielding,
          charmPoints: dto.charmPoints,
          charmExpansion: dto.charmExpansion == 'true',
          inventoryValue: dto.inventoryValue,
          transferable: dto.transferable == 'true',
          transferAvailableAt: dto.depositransferAvailableAt,
          premiumEndsAt: dto.premiumEndsAt,
          hasRecoveryKey: dto.hasRecoveryKey == 'true',
          safeAddress: dto.safeAddress == 'true',
          metadata: dto.metadata || {},
          Charms: {
            connect: dto.charmsId?.map((id) => ({ id })) || [],
          },
          Mounts: {
            connect: dto.mountsId?.map((id) => ({ id })) || [],
          },
          Outfits: {
            create:
              dto.outfits?.map((outfit) => ({
                outfitId: outfit.id,
                nivel: outfit.level,
              })) || [],
          },
        },
      });
    });

    return { message: 'Registro de novo personagem feito com sucesso.' };
  }

  async edit(id: string, dto: ProductCharacterEditDto) {
    const character = await this.prisma.productCharacter.findUnique({
      where: { id },
    });
    if (!character) throw new ConflictException('Personagem não encontrado.');

    let title = character.title;
    if (dto.title) {
      title = dto.title;
    }

    let slug = dto.slug || character.slug;
    if (dto.title && !dto.slug && title !== character.title) {
      let baseSlug = title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 200);
      slug = baseSlug;
      let slugExists = await this.prisma.productCharacter.findUnique({
        where: { slug },
      });
      if (slugExists && slugExists.id !== id) {
        slug = slug + '-' + generateCode();
      }
    }

    await this.prisma.productCharacter.update({
      where: { id },
      data: {
        isFeatured: dto.isFeatured
          ? dto.isFeatured === 'true'
          : character.isFeatured,
        order: dto.order ?? character.order,
        title,
        slug,
        description:
          dto.description !== undefined
            ? dto.description
            : character.description,
        price: dto.price ?? character.price,
        promotionalPrice:
          dto.promotionalPrice !== undefined
            ? dto.promotionalPrice
            : character.promotionalPrice,
        priceTibiaCoins: dto.priceTibiaCoins ?? character.priceTibiaCoins,
        promotionalPriceTibiaCoins:
          dto.promotionalPriceTibiaCoins !== undefined
            ? dto.promotionalPriceTibiaCoins
            : character.promotionalPriceTibiaCoins,
        vocation: dto.vocation ?? character.vocation,
        level: dto.level ?? character.level,
        gender: dto.gender ?? character.gender,
        loyalty: dto.loyalty ?? character.loyalty,
        worldId: dto.worldId ?? character.worldId,
        magicLevel: dto.magicLevel ?? character.magicLevel,
        fistFighting: dto.fistFighting ?? character.fistFighting,
        swordFighting: dto.swordFighting ?? character.swordFighting,
        axeFighting: dto.axeFighting ?? character.axeFighting,
        clubFighting: dto.clubFighting ?? character.clubFighting,
        distanceFighting: dto.distanceFighting ?? character.distanceFighting,
        shielding: dto.shielding ?? character.shielding,
        charmPoints: dto.charmPoints ?? character.charmPoints,
        charmExpansion:
          dto.charmExpansion !== undefined
            ? dto.charmExpansion === 'true'
            : character.charmExpansion,
        inventoryValue:
          dto.inventoryValue !== undefined
            ? dto.inventoryValue
            : character.inventoryValue,
        transferable:
          dto.transferable !== undefined
            ? dto.transferable === 'true'
            : character.transferable,
        transferAvailableAt:
          dto.depositransferAvailableAt !== undefined
            ? dto.depositransferAvailableAt
            : character.transferAvailableAt,
        premiumEndsAt:
          dto.premiumEndsAt !== undefined
            ? dto.premiumEndsAt
            : character.premiumEndsAt,
        hasRecoveryKey:
          dto.hasRecoveryKey !== undefined
            ? dto.hasRecoveryKey === 'true'
            : character.hasRecoveryKey,
        safeAddress:
          dto.safeAddress !== undefined
            ? dto.safeAddress === 'true'
            : character.safeAddress,
        metadata: (dto.metadata !== undefined
          ? dto.metadata
          : character.metadata) as Prisma.InputJsonValue,
        seoTitle:
          dto.seoTitle !== undefined ? dto.seoTitle : character.seoTitle,
        seoDescription:
          dto.seoDescription !== undefined
            ? dto.seoDescription
            : character.seoDescription,
        Charms: dto.charmsId
          ? {
              set: dto.charmsId.map((id) => ({ id })),
            }
          : undefined,
        Mounts: dto.mountsId
          ? {
              set: dto.mountsId.map((id) => ({ id })),
            }
          : undefined,
        Outfits: dto.outfits
          ? {
              deleteMany: {},
              create: dto.outfits.map((outfit) => ({
                outfitId: outfit.id,
                nivel: outfit.level,
              })),
            }
          : undefined,
      },
    });

    return { message: 'Personagem atualizado com sucesso.' };
  }

  async enable(id: string) {
    const character = await this.prisma.productCharacter.findUnique({
      where: { id },
    });
    if (!character) throw new ConflictException('Personagem não encontrado.');

    await this.prisma.productCharacter.update({
      where: { id },
      data: { disabledAt: null },
    });

    return { message: 'Personagem habilitado com sucesso.' };
  }

  async disable(id: string) {
    const character = await this.prisma.productCharacter.findUnique({
      where: { id },
    });
    if (!character) throw new ConflictException('Personagem não encontrado.');

    await this.prisma.productCharacter.update({
      where: { id },
      data: { disabledAt: new Date() },
    });

    return { message: 'Personagem desabilitado com sucesso.' };
  }

  async delete(id: string) {
    const character = await this.prisma.productCharacter.findUnique({
      where: { id },
    });
    if (!character) throw new ConflictException('Personagem não encontrado.');

    await this.prisma.productCharacter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Personagem deletado com sucesso.' };
  }

  async uploadImage(characterId: string, req: FastifyRequest) {
    const character = await this.prisma.productCharacter.findUnique({
      where: { id: characterId },
      include: {
        Images: {
          take: 1,
          orderBy: { index: 'desc' },
        },
      },
    });

    if (!character) {
      throw new NotFoundException('Personagem não encontrado.');
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

    const index =
      character.Images.length > 0 ? character.Images[0].index + 1 : 0;

    await this.prisma.image.create({
      data: {
        url: uploadedFileUrl,
        productCharacterId: characterId,
        index,
      },
    });

    return { message: 'Imagem do personagem enviada com sucesso.' };
  }

  async deleteImage(characterId: string, imageId: string) {
    const imageCount = await this.prisma.image.count({
      where: { productCharacterId: characterId },
    });

    if (imageCount === 1) {
      throw new UnprocessableEntityException(
        'Não é possível deletar a última imagem do personagem.',
      );
    }

    const image = await this.prisma.image.findUnique({
      where: { id: imageId, productCharacterId: characterId },
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

  async reorderImages(characterId: string, dto: ImageReorderDto) {
    const character = await this.prisma.productCharacter.findUnique({
      where: { id: characterId },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado.');

    await this.prisma.$transaction(
      dto.imageIds.map((id, index) =>
        this.prisma.image.update({
          where: { id, productCharacterId: characterId },
          data: { index: index + 1000 },
        }),
      ),
    );

    const length = dto.imageIds.length;
    await this.prisma.$transaction(
      dto.imageIds.map((id, index) =>
        this.prisma.image.update({
          where: { id, productCharacterId: characterId },
          data: { index: length - index },
        }),
      ),
    );

    return { message: 'Imagens reordenadas com sucesso.' };
  }

  async reorderCharacters(dto: ProductCharacterReorderDto) {
    await this.prisma.$transaction(
      dto.characterIds.map((id, index) =>
        this.prisma.productCharacter.update({
          where: { id },
          data: { order: index + 1000 },
        }),
      ),
    );

    const length = dto.characterIds.length;
    await this.prisma.$transaction(
      dto.characterIds.map((id, index) =>
        this.prisma.productCharacter.update({
          where: { id },
          data: { order: length - index },
        }),
      ),
    );

    return { message: 'Personagens reordenados com sucesso.' };
  }
}
