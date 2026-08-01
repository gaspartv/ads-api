import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateCompanyThemeDto } from './dtos/update-company-theme.dto';
import { CompanyEditDto } from './dtos/company.edit.dto';
import type { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { envConfig } from 'src/configs/env.config';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];

const SIZE_LIMITS = {
  logo: 2 * 1024 * 1024, // 2MB
  favicon: 512 * 1024, // 512KB
  banner: 10 * 1024 * 1024, // 10MB
} as const;

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getInfoByCode(code: string) {
    const company = await this.prisma.company.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        slogan: true,
        whatsappNumber: true,
        logo: true,
        favicon: true,
        banner: true,
        theme: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return {
      ...company,
      logo: company.logo ? envConfig.BACKEND_URL + company.logo : null,
      banner: company.banner ? envConfig.BACKEND_URL + company.banner : null,
      favicon: company.favicon ? envConfig.BACKEND_URL + company.favicon : null,
    };
  }

  async getInfoContact(code: string) {
    const company = await this.prisma.company.findUnique({
      where: { code },
      select: {
        id: true,
        name: true,
        description: true,
        whatsappNumber: true,
        businessHours: true,
        socialNetworks: true,
        Addresses: true,
      },
    });
  }

  async edit(companyId: string, dto: CompanyEditDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException(
        'Não foi possível encontrar o registro da sua empresa.',
      );
    }

    if (dto.code) {
      const code = await this.prisma.company.findUnique({
        where: { code: dto.code },
      });
      if (code && code.id !== company.id) {
        throw new UnprocessableEntityException(
          'Já existe uma empresa cadastrada com o código informado.',
        );
      }
    }

    if (dto.cnpj && dto.cnpj !== company.cnpj) {
      const cnpj = await this.prisma.company.findFirst({
        where: { cnpj: dto.cnpj },
      });
      if (cnpj) {
        throw new UnprocessableEntityException(
          'Já existe uma empresa cadastrada com o CNPJ informado.',
        );
      }
    }

    if (dto.email && dto.email !== company.email) {
      const email = await this.prisma.company.findUnique({
        where: { email: dto.email },
      });
      if (email) {
        throw new UnprocessableEntityException(
          'Já existe uma empresa cadastrada com o e-mail informado.',
        );
      }
    }

    if (dto.whatsappNumber && dto.whatsappNumber !== company.whatsappNumber) {
      const whatsappNumber = await this.prisma.company.findUnique({
        where: { whatsappNumber: dto.whatsappNumber },
      });
      if (whatsappNumber) {
        throw new UnprocessableEntityException(
          'Já existe uma empresa cadastrada com o whatsapp informado.',
        );
      }
    }

    if (dto.site && dto.site !== company.site) {
      const site = await this.prisma.company.findUnique({
        where: {
          site: dto.site,
        },
      });
      if (site) {
        throw new UnprocessableEntityException(
          'Já existe uma empresa cadastrada com o site informado.',
        );
      }
    }

    await this.prisma.company.update({
      where: { id: companyId },
      data: dto,
    });

    return { message: 'Empresa atualizada com sucesso.' };
  }

  async my(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId, deletedAt: null, disabledAt: null },
      select: {
        id: true,
        code: true,
        createdAt: true,
        name: true,
        description: true,
        slogan: true,
        cnpj: true,
        email: true,
        whatsappNumber: true,
        logo: true,
        favicon: true,
        banner: true,
        site: true,
        seoTitle: true,
        seoDescription: true,
      },
    });
    if (!company) {
      throw new NotFoundException(
        'Não foi possível encontrar o registro da sua empresa.',
      );
    }
    return {
      ...company,
      logo: company.logo ? envConfig.BACKEND_URL + company.logo : null,
      banner: company.banner ? envConfig.BACKEND_URL + company.banner : null,
      favicon: company.favicon ? envConfig.BACKEND_URL + company.favicon : null,
    };
  }

  async updateTheme(companyId: string, themeData: UpdateCompanyThemeDto) {
    return await this.prisma.company.update({
      where: { id: companyId },
      data: {
        theme: themeData as any,
      },
      select: {
        id: true,
        theme: true,
      },
    });
  }

  private async uploadSystemImage(
    companyId: string,
    req: FastifyRequest,
    fieldName: 'logo' | 'favicon' | 'banner',
  ) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(
        'Não foi possível encontrar o registro da sua empresa.',
      );
    }

    const data = await req.file();
    if (!data) {
      throw new UnprocessableEntityException('Arquivo não enviado.');
    }

    if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
      throw new UnprocessableEntityException(
        'Tipo de arquivo inválido. Envie uma imagem (JPEG, PNG, WebP, GIF, SVG ou ICO).',
      );
    }

    const maxSize = SIZE_LIMITS[fieldName];
    const chunks: Buffer[] = [];
    let totalSize = 0;

    for await (const chunk of data.file) {
      totalSize += chunk.length;
      if (totalSize > maxSize) {
        const limitLabel =
          fieldName === 'favicon'
            ? '512KB'
            : fieldName === 'logo'
              ? '2MB'
              : '5MB';
        throw new UnprocessableEntityException(
          `O arquivo excede o tamanho máximo permitido para ${fieldName} (${limitLabel}).`,
        );
      }
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);
    const ext = path.extname(data.filename) || '.jpg';
    const filename = `${fieldName}${ext}`;
    const uploadDir = path.join(
      process.cwd(),
      'uploads',
      company.code,
      'system',
    );
    const filePath = path.join(uploadDir, filename);

    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Remove qualquer arquivo antigo com o mesmo nome base (independente da extensão)
    try {
      const existingFiles = await fs.promises.readdir(uploadDir);
      for (const file of existingFiles) {
        const base = path.basename(file, path.extname(file));
        if (base === fieldName) {
          await fs.promises.unlink(path.join(uploadDir, file));
        }
      }
    } catch {
      // diretório pode estar vazio ou não existir ainda, sem problema
    }

    await fs.promises.writeFile(filePath, fileBuffer);

    const uploadedFileUrl = `/uploads/${company.code}/system/${filename}`;

    await this.prisma.company.update({
      where: { id: companyId },
      data: { [fieldName]: uploadedFileUrl },
    });

    return {
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} atualizado com sucesso.`,
      url: envConfig.BACKEND_URL + uploadedFileUrl,
    };
  }

  async uploadLogo(companyId: string, req: FastifyRequest) {
    return this.uploadSystemImage(companyId, req, 'logo');
  }

  async uploadFavicon(companyId: string, req: FastifyRequest) {
    return this.uploadSystemImage(companyId, req, 'favicon');
  }

  async uploadBanner(companyId: string, req: FastifyRequest) {
    return this.uploadSystemImage(companyId, req, 'banner');
  }
}
