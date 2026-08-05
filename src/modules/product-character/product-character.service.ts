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
import { ProductCharacterCardContentDto } from './dtos/product-character.card-content.dto';
import { generateCode } from 'src/functions/generate-code';
import { BattleyeType, Prisma } from 'src/generated/prisma/client';
import { envConfig } from 'src/configs/env.config';
import type { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { pipeline } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { ProductCharacterImageReorderDto } from './dtos/product-character.image-reorder.dto';

const pump = util.promisify(pipeline);

@Injectable()
export class ProductCharacterService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolve a pictureUrl a partir do OutfitGender, usando o outfitId, gender e level.
   */
  private async resolvePictureUrl(
    outfitId: string,
    gender: string,
    level: string,
  ): Promise<string | null> {
    const outfitGender = await this.prisma.outfitGender.findFirst({
      where: { outfitId, gender: gender as any },
    });

    if (!outfitGender) return null;

    if (level === 'FULL' && outfitGender.full) return outfitGender.full;
    if (level === 'ADDON_TWO' && outfitGender.addonTwo)
      return outfitGender.addonTwo;
    if (level === 'ADDON_ONE' && outfitGender.addonOne)
      return outfitGender.addonOne;
    return outfitGender.outfit;
  }

  async findPublic(slug: string, companyId: string) {
    const character = await this.prisma.productCharacter.findFirst({
      where: { slug, companyId },
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
      pictureUrl: character?.pictureUrl
        ? envConfig.BACKEND_URL + character?.pictureUrl
        : null,
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

    if (pagination.minPrice || pagination.maxPrice) {
      const minPrice = pagination.minPrice ? Number(pagination.minPrice) : 0;
      const maxPrice = pagination.maxPrice
        ? Number(pagination.maxPrice)
        : Number.MAX_SAFE_INTEGER;
      where.AND = where.AND || [];
      (where.AND as any[]).push({
        OR: [
          { promotionalPrice: { gte: minPrice, lte: maxPrice } },
          { promotionalPrice: null, price: { gte: minPrice, lte: maxPrice } },
        ],
      });
    }

    if (pagination.minPriceTibiaCoins || pagination.maxPriceTibiaCoins) {
      const minPriceTC = pagination.minPriceTibiaCoins
        ? Number(pagination.minPriceTibiaCoins)
        : 0;
      const maxPriceTC = pagination.maxPriceTibiaCoins
        ? Number(pagination.maxPriceTibiaCoins)
        : Number.MAX_SAFE_INTEGER;
      where.AND = where.AND || [];
      (where.AND as any[]).push({
        OR: [
          { promotionalPriceTibiaCoins: { gte: minPriceTC, lte: maxPriceTC } },
          {
            promotionalPriceTibiaCoins: null,
            priceTibiaCoins: { gte: minPriceTC, lte: maxPriceTC },
          },
        ],
      });
    }

    if (pagination.vocation) where.vocation = pagination.vocation as any;
    if (pagination.gender) where.gender = pagination.gender as any;
    if (pagination.worldId) where.worldId = pagination.worldId;

    if (pagination.minLevel || pagination.maxLevel) {
      where.level = {};
      if (pagination.minLevel)
        (where.level as any).gte = Number(pagination.minLevel);
      if (pagination.maxLevel)
        (where.level as any).lte = Number(pagination.maxLevel);
    }
    if (pagination.minLoyalty || pagination.maxLoyalty) {
      where.loyalty = {};
      if (pagination.minLoyalty)
        (where.loyalty as any).gte = Number(pagination.minLoyalty);
      if (pagination.maxLoyalty)
        (where.loyalty as any).lte = Number(pagination.maxLoyalty);
    }
    if (pagination.minCharmPoints || pagination.maxCharmPoints) {
      where.charmPoints = {};
      if (pagination.minCharmPoints)
        (where.charmPoints as any).gte = Number(pagination.minCharmPoints);
      if (pagination.maxCharmPoints)
        (where.charmPoints as any).lte = Number(pagination.maxCharmPoints);
    }

    if (pagination.minMagicLevel || pagination.maxMagicLevel) {
      where.magicLevel = {};
      if (pagination.minMagicLevel)
        (where.magicLevel as any).gte = Number(pagination.minMagicLevel);
      if (pagination.maxMagicLevel)
        (where.magicLevel as any).lte = Number(pagination.maxMagicLevel);
    }
    if (pagination.minFistFighting || pagination.maxFistFighting) {
      where.fistFighting = {};
      if (pagination.minFistFighting)
        (where.fistFighting as any).gte = Number(pagination.minFistFighting);
      if (pagination.maxFistFighting)
        (where.fistFighting as any).lte = Number(pagination.maxFistFighting);
    }
    if (pagination.minSwordFighting || pagination.maxSwordFighting) {
      where.swordFighting = {};
      if (pagination.minSwordFighting)
        (where.swordFighting as any).gte = Number(pagination.minSwordFighting);
      if (pagination.maxSwordFighting)
        (where.swordFighting as any).lte = Number(pagination.maxSwordFighting);
    }
    if (pagination.minAxeFighting || pagination.maxAxeFighting) {
      where.axeFighting = {};
      if (pagination.minAxeFighting)
        (where.axeFighting as any).gte = Number(pagination.minAxeFighting);
      if (pagination.maxAxeFighting)
        (where.axeFighting as any).lte = Number(pagination.maxAxeFighting);
    }
    if (pagination.minClubFighting || pagination.maxClubFighting) {
      where.clubFighting = {};
      if (pagination.minClubFighting)
        (where.clubFighting as any).gte = Number(pagination.minClubFighting);
      if (pagination.maxClubFighting)
        (where.clubFighting as any).lte = Number(pagination.maxClubFighting);
    }
    if (pagination.minDistanceFighting || pagination.maxDistanceFighting) {
      where.distanceFighting = {};
      if (pagination.minDistanceFighting)
        (where.distanceFighting as any).gte = Number(
          pagination.minDistanceFighting,
        );
      if (pagination.maxDistanceFighting)
        (where.distanceFighting as any).lte = Number(
          pagination.maxDistanceFighting,
        );
    }
    if (pagination.minShielding || pagination.maxShielding) {
      where.shielding = {};
      if (pagination.minShielding)
        (where.shielding as any).gte = Number(pagination.minShielding);
      if (pagination.maxShielding)
        (where.shielding as any).lte = Number(pagination.maxShielding);
    }
    if (pagination.minFishing || pagination.maxFishing) {
      where.fishing = {};
      if (pagination.minFishing)
        (where.fishing as any).gte = Number(pagination.minFishing);
      if (pagination.maxFishing)
        (where.fishing as any).lte = Number(pagination.maxFishing);
    }

    if (pagination.charmExpansion)
      where.charmExpansion = pagination.charmExpansion === 'true';
    if (pagination.transferable)
      where.transferable = pagination.transferable === 'true';
    if (pagination.hasRecoveryKey)
      where.hasRecoveryKey = pagination.hasRecoveryKey === 'true';
    if (pagination.safeAddress)
      where.safeAddress = pagination.safeAddress === 'true';

    if (pagination.battleye) {
      where.World = {
        battleye: pagination.battleye,
      };
    }

    if (pagination.pvpType) {
      where.World = {
        pvpType: pagination.pvpType,
      };
    }

    const orderBy = pagination.orderBy || 'order';
    const orderType = pagination.orderType || 'asc';
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 10;

    const total = await this.prisma.productCharacter.count({ where });

    const characters = await this.prisma.productCharacter.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { [orderBy]: orderType }],
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
        pictureUrl: character.pictureUrl
          ? envConfig.BACKEND_URL + character.pictureUrl
          : null,
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

  async create(dto: ProductCharacterCreateDto, companyId: string) {
    let code: string;
    let codeExists: any;
    do {
      code = generateCode();
      codeExists = await this.prisma.productCharacter.findFirst({
        where: { code, companyId },
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

    // Resolve pictureUrl a partir do outfit selecionado
    let pictureUrl = dto.pictureUrl;
    if (dto.pictureOutfitId && dto.pictureOutfitLevel) {
      const resolved = await this.resolvePictureUrl(
        dto.pictureOutfitId,
        dto.gender,
        dto.pictureOutfitLevel,
      );
      if (resolved) pictureUrl = resolved;
    }

    await this.prisma.$transaction(async (tx) => {
      const productCharacter = await tx.productCharacter.create({
        data: {
          columns: {},
          companyId,
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
          ...(pictureUrl ? { pictureUrl } : {}),
          vocation: dto.vocation,
          level: dto.level,
          gender: dto.gender,
          loyalty: dto.loyalty,
          worldId: dto.worldId,
          magicLevel: dto.magicLevel,
          magicLevelExtra: dto.magicLevelExtra,
          fistFighting: dto.fistFighting,
          fistFightingExtra: dto.fistFightingExtra,
          swordFighting: dto.swordFighting,
          swordFightingExtra: dto.swordFightingExtra,
          axeFighting: dto.axeFighting,
          axeFightingExtra: dto.axeFightingExtra,
          clubFighting: dto.clubFighting,
          clubFightingExtra: dto.clubFightingExtra,
          distanceFighting: dto.distanceFighting,
          distanceFightingExtra: dto.distanceFightingExtra,
          fishing: dto.fishing,
          fishingExtra: dto.fishingExtra,
          shielding: dto.shielding,
          shieldingExtra: dto.shieldingExtra,
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

  async edit(id: string, companyId: string, dto: ProductCharacterEditDto) {
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
      let slugExists = await this.prisma.productCharacter.findFirst({
        where: { slug, companyId },
      });
      if (slugExists && slugExists.id !== id) {
        slug = slug + '-' + generateCode();
      }
    }

    // Resolve pictureUrl a partir do outfit selecionado
    const gender = dto.gender ?? character.gender;
    let pictureUrl: string | undefined;
    if (dto.pictureOutfitId && dto.pictureOutfitLevel) {
      const resolved = await this.resolvePictureUrl(
        dto.pictureOutfitId,
        gender,
        dto.pictureOutfitLevel,
      );
      if (resolved) pictureUrl = resolved;
    } else if (dto.pictureUrl !== undefined) {
      pictureUrl = dto.pictureUrl;
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
        magicLevelExtra:
          dto.magicLevelExtra !== undefined
            ? dto.magicLevelExtra
            : character.magicLevelExtra,
        fistFighting: dto.fistFighting ?? character.fistFighting,
        fistFightingExtra:
          dto.fistFightingExtra !== undefined
            ? dto.fistFightingExtra
            : character.fistFightingExtra,
        swordFighting: dto.swordFighting ?? character.swordFighting,
        swordFightingExtra:
          dto.swordFightingExtra !== undefined
            ? dto.swordFightingExtra
            : character.swordFightingExtra,
        axeFighting: dto.axeFighting ?? character.axeFighting,
        axeFightingExtra:
          dto.axeFightingExtra !== undefined
            ? dto.axeFightingExtra
            : character.axeFightingExtra,
        clubFighting: dto.clubFighting ?? character.clubFighting,
        clubFightingExtra:
          dto.clubFightingExtra !== undefined
            ? dto.clubFightingExtra
            : character.clubFightingExtra,
        distanceFighting: dto.distanceFighting ?? character.distanceFighting,
        distanceFightingExtra:
          dto.distanceFightingExtra !== undefined
            ? dto.distanceFightingExtra
            : character.distanceFightingExtra,
        fishing: dto.fishing ?? character.fishing,
        fishingExtra:
          dto.fishingExtra !== undefined
            ? dto.fishingExtra
            : character.fishingExtra,
        shielding: dto.shielding ?? character.shielding,
        shieldingExtra:
          dto.shieldingExtra !== undefined
            ? dto.shieldingExtra
            : character.shieldingExtra,
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
        ...(pictureUrl !== undefined ? { pictureUrl } : {}),
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

  async uploadImage(
    characterId: string,
    companyCode: string,
    req: FastifyRequest,
  ) {
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
    const filename = `${character.slug}-${Date.now()}${ext}`;
    const uploadDir = path.join(
      process.cwd(),
      'uploads',
      companyCode,
      'characters',
      character.code,
    );
    const filePath = path.join(uploadDir, filename);

    await fs.promises.mkdir(uploadDir, { recursive: true });

    await pump(data.file, fs.createWriteStream(filePath));

    const uploadedFileUrl = `/uploads/${companyCode}/characters/${character.code}/${filename}`;

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

  async deleteImage(characterId: string, imageId: string, companyCode: string) {
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

    const character = await this.prisma.productCharacter.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    const filename = image.url.split('/').pop();
    if (filename) {
      const filePath = path.join(
        process.cwd(),
        'uploads',
        companyCode,
        'characters',
        character.code,
        filename,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.prisma.image.delete({
      where: { id: imageId },
    });

    return { message: 'Imagem deletada com sucesso.' };
  }

  async reorderImages(
    characterId: string,
    dto: ProductCharacterImageReorderDto,
  ) {
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

  async getCardContent(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { cardContent: true },
    });
    return company?.cardContent || [];
  }

  async editCardContent(
    companyId: string,
    dto: ProductCharacterCardContentDto,
  ) {
    await this.prisma.company.update({
      where: { id: companyId },
      data: { cardContent: dto.cardContent },
    });
    return { message: 'Conteúdo do card atualizado com sucesso.' };
  }
}
