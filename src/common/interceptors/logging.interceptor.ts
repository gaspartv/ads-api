import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (data) => {
        await this.log(context, data);
      }),
    );
  }

  async log(context: ExecutionContext, responseBody: any) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    await this.prisma.log.create({
      data: {
        userId: request.user?.id || null,
        method: request.method,
        endpoint: request.url,
        statusCode: response.statusCode,
        request: request.body,
        response: responseBody,
        companyId: request.company.id,
      },
    });
  }
}
