import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateCompanyThemeDto } from './dtos/update-company-theme.dto';
import { CompanyEditDto } from './dtos/company.edit.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getInfoByCode(code: string) {
    return await this.prisma.company.findUnique({
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
    return company;
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
}
