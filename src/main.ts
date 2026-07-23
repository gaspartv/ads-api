import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { envConfig } from './configs/env.config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaService } from './providers/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();

  await app.register(fastifyCookie, {
    secret: envConfig.APP_SECRET_KEY,
    parseOptions: {
      httpOnly: true,
    },
  });

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 5MB
    },
  });

  app.useStaticAssets({
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new LoggingInterceptor(new PrismaService()));

  app.enableShutdownHooks();

  await app.listen(envConfig.PORT, '0.0.0.0', () => {
    console.log(`Application is running on: ${envConfig.PORT}`);
    if (process.send) {
      process.send('ready');
    }
  });
}
bootstrap();
