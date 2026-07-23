import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { AdminSystemCompanyCreateDto } from './dtos/company/company.create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSystemService {
  constructor(private readonly prisma: PrismaService) {}

  async companyCreate(dto: AdminSystemCompanyCreateDto) {
    const { addresses, company, user, companyModule } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const companyCreate = await tx.company.create({
        data: {
          code: company.code,
          name: company.name,
          description: company.description,
          slogan: company.slogan,
          cnpj: company.cnpj,
          email: company.email,
          whatsappNumber: company.whatsappNumber,
          logo: company.logo,
          favicon: company.favicon,
          banner: company.banner,
          site: company.site,
          seoTitle: company.seoTitle,
          seoDescription: company.seoDescription,
          businessHours: company.businessHours as any,
          settings: company.settings as any,
          theme: company.theme as any,
          socialNetworks: company.socialNetworks as any,
          integrations: company.integrations as any,
        },
      });

      for await (const address of addresses) {
        await tx.address.create({
          data: {
            companyId: companyCreate.id,
            name: address.name,
            address: address.address,
            number: address.number,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
            reference: address.reference,
          },
        });
      }

      const hashedPassword = bcrypt.hashSync(user.passwordHash, 10);

      await tx.user.create({
        data: {
          companyId: companyCreate.id,
          code: user.code,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          passwordHash: hashedPassword,
          type: user.type,
        },
      });

      for await (const module of companyModule) {
        await tx.companyModule.create({
          data: {
            companyId: companyCreate.id,
            moduleId: module.moduleId,
            enabled: module.enabled,
            startsAt: module.startsAt,
            expiresAt: module.expiresAt,
          },
        });
      }

      await tx.productTibiaCoins.createMany({
        data: [
          {
            companyId: companyCreate.id,
            type: 'BUY',
            name: 'Comprar Tibia Coins',
            slug: 'buy-tibia-coins',
            description:
              'As Tibia Coins são uma moeda utilizada no jogo Tibia, criada pela empresa Cipsoft. Com elas, os jogadores podem comprar produtos na Store do jogo, como montarias, itens de decoração, poções e serviços como transferência de mundo. Além disso, as Tibia Coins podem ser vendidas no market ou utilizadas para comprar personagens no Bazaar. As Tibia Coins são transferíveis para outros jogadores e não ficam bloqueadas por um prazo específico, tornando-as uma opção prática para a compra de itens no jogo.',
            amount: 0,
            seoTitle:
              'Comprar Tibia Coins Barato e Confiável | Tibia Coin Store',
            seoDescription:
              'Compre Tibia Coins de forma segura e rápida na Tibia Coin Store. Aqui você encontra os melhores preços e condições especiais para adquirir seus Tibia Coins e aproveitar ao máximo sua experiência no jogo.',
            columns: {
              createdAt: {
                enable: false,
                order: 1,
              },
              updatedAt: {
                enable: false,
                order: 2,
              },
              disabledAt: {
                enable: false,
                order: 3,
              },
              type: {
                enable: true,
                order: 4,
              },
              description: {
                enable: true,
                order: 5,
              },
              amount: {
                enable: true,
                order: 6,
              },
              seoTitle: {
                enable: true,
                order: 7,
              },
              seoDescription: {
                enable: true,
                order: 8,
              },
            },
          },
          {
            companyId: companyCreate.id,
            type: 'SELL',
            name: 'Vender Tibia Coins',
            slug: 'sell-tibia-coins',
            description:
              'As Tibia Coins são uma moeda utilizada no jogo Tibia, criada pela empresa Cipsoft. Com elas, os jogadores podem comprar produtos na Store do jogo, como montarias, itens de decoração, poções e serviços como transferência de mundo. Além disso, as Tibia Coins podem ser vendidas no market ou utilizadas para comprar personagens no Bazaar. As Tibia Coins são transferíveis para outros jogadores e não ficam bloqueadas por um prazo específico, tornando-as uma opção prática para a compra de itens no jogo.',
            amount: 0,
            seoTitle:
              'Vender Tibia Coins Barato e Confiável | Tibia Coin Store',
            seoDescription:
              'Vender Tibia Coins de forma segura e rápida na Tibia Coin Store. Aqui você encontra os melhores preços e condições especiais para adquirir seus Tibia Coins e aproveitar ao máximo sua experiência no jogo.',
            columns: {
              createdAt: {
                enable: false,
                order: 1,
              },
              updatedAt: {
                enable: false,
                order: 2,
              },
              disabledAt: {
                enable: false,
                order: 3,
              },
              type: {
                enable: true,
                order: 4,
              },
              description: {
                enable: true,
                order: 5,
              },
              amount: {
                enable: true,
                order: 6,
              },
              seoTitle: {
                enable: true,
                order: 7,
              },
              seoDescription: {
                enable: true,
                order: 8,
              },
            },
          },
        ],
      });

      return { message: 'Nova empresa cadastrada com sucesso.' };
    });
  }
}
