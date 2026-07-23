import { UserType } from 'src/generated/prisma/enums';

export class AdminSystemCompanyCreateDto {
  company: {
    code: string;
    name: string;
    description?: string;
    slogan?: string;
    cnpj?: string;
    email: string;
    whatsappNumber: string;
    logo?: string;
    favicon?: string;
    banner?: string;
    site: string;
    seoTitle?: string;
    seoDescription?: string;
    businessHours: {
      Domingo: string;
      Segunda: string;
      Terca: string;
      Quarta: string;
      Quinta: string;
      Sexta: string;
      Sabado: string;
    };
    settings: {};
    theme: {};
    socialNetworks: {
      Instagram?: string;
      Facebook?: string;
      Youtube?: string;
    };
    integrations: {};
  };
  addresses: {
    name: string;
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    reference: string;
  }[];
  user: {
    code: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    type: UserType;
  };
  companyModule: {
    enabled: true;
    startsAt: string;
    expiresAt: string;
    moduleId: string;
  }[];
}
