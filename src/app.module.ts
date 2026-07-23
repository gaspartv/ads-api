import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './providers/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from './configs/env.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { ReportsModule } from './modules/reports/reports.module';
import { ProductTibiaCoinsModule } from './modules/product-tibia-coins/product-tibia-coins.module';
import { CompanyModule } from './modules/company/company.module';
import { ProductCharacterModule } from './modules/product-character/product-character.module';
import { InfoModule } from './modules/info/info.module';
import { ProductAccountLoyaltyModule } from './modules/product-account-loyalty/product-account-loyalty.module';
import { OrderModule } from './modules/order/order.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AdminSystemModule } from './modules/admin-system/admin-system.module';

@Module({
  imports: [
    // Modules
    AdminSystemModule,
    CompanyModule,
    InfoModule,
    CustomerModule,
    OrderModule,
    ProductAccountLoyaltyModule,
    ProductCharacterModule,
    ProductTibiaCoinsModule,
    ReportsModule,
    UserModule,

    // Provideres
    PrismaModule,

    // System
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        process.env.DOTENV_CONFIG_PATH ||
          (process.env.NODE_ENV === 'development'
            ? '.env.development.local'
            : '.env'),
      ],
    }),

    JwtModule.register({
      global: true,
      secret: envConfig.JWT_SECRET,
    }),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
