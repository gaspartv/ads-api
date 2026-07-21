import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class InfoService {
  constructor(private readonly prisma: PrismaService) {}

  listWorlds() {
    return this.prisma.world.findMany();
  }

  listCharms() {
    return this.prisma.charm.findMany();
  }

  listOutfits() {
    return this.prisma.outfit.findMany();
  }

  listMounts() {
    return this.prisma.mount.findMany();
  }

  listModules(companyId: string) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        CompanyModules: {
          include: {
            Module: true,
          },
          where: {
            enabled: true,
            OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
          },
        },
      },
    });
  }
}
