import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateCompanyThemeDto } from './dtos/update-company-theme.dto';

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
