import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';

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
        whatsappNumber: true,
      },
    });
  }
}
