import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from './modules/log/log.module';
import { PrismaModule } from './providers/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from './configs/env.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { StockBatchModule } from './modules/stock-batch/stock-batch.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ProductTibiaCoinsModule } from './modules/product-tibia-coins/product-tibia-coins.module';
import { CompanyModule } from './modules/company/company.module';
import { ProductCharacterModule } from './modules/product-character/product-character.module';
import { InfoModule } from './modules/info/info.module';
import { ProductAccountLoyaltyModule } from './modules/product-account-loyalty/product-account-loyalty.module';

@Module({
  imports: [
    // Modules
    CategoryModule,
    CompanyModule,
    InfoModule,
    LogModule,
    ProductModule,
    ProductAccountLoyaltyModule,
    ProductCharacterModule,
    ProductTibiaCoinsModule,
    ReportsModule,
    StockBatchModule,
    UserModule,

    // Provideres
    PrismaModule,

    // System
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development.local'],
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
