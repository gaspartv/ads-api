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
}
