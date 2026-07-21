import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async searchByWhatsapp(whatsapp: string, companyId: string) {
    return this.prisma.customer.findMany({
      where: { whatsappNumber: { contains: whatsapp }, companyId },
      take: 5,
    });
  }

  async create(data: {
    name: string;
    whatsappNumber?: string;
    companyId: string;
  }) {
    if (data.whatsappNumber) {
      const digits = data.whatsappNumber.replace(/\D/g, '');

      // Formato esperado: DDI (2) + DDD (2) + 9 + número (8) = 13 dígitos
      // Exemplo: 5511987654321
      const isValid = /^\d{2}\d{2}9\d{8}$/.test(digits);

      if (!isValid) {
        throw new BadRequestException(
          'Número de WhatsApp inválido. Informe DDI + DDD + 9 + número (ex: 5511987654321).',
        );
      }

      data = { ...data, whatsappNumber: digits };
    }

    return this.prisma.customer.create({
      data,
    });
  }
}
