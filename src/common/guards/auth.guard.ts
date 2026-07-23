import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/is_public.decorator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { envConfig } from 'src/configs/env.config';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { JwtPayloadDto } from '../dtos/jwt.payload.dto';
import { IS_ADMIN_ONLY_KEY } from '../decorators/is_admin_only.decorator';
import { UserType } from 'src/generated/prisma/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    console.log(request.url);

    if (request.url.startsWith('/admin-system')) {
      return true;
    }

    // Tenta pegar a URL do frontend (origin ou referer).
    // Removemos request.headers.host para evitar que a API leia o próprio host,
    // o que quebra o suporte a múltiplos frontends.
    const origin = (request.headers.origin ||
      request.headers.referer ||
      request.headers['x-forwarded-host']) as string | undefined;

    let code = '';
    if (origin) {
      try {
        let urlString = origin;
        if (!urlString.startsWith('http')) {
          urlString = `http://${urlString}`;
        }
        const url = new URL(urlString);
        const parts = url.hostname.split('.');

        // Ignora subdomínios como 'www' ou 'api' (ex: api.thygas-coins.com.br vira thygas-coins)
        if ((parts[0] === 'www' || parts[0] === 'api') && parts.length > 1) {
          code = parts[1];
        } else {
          code = parts[0];
        }
      } catch (e) {
        // ignore
      }
    }

    const companyFound = await this.prisma.company.findUnique({
      where: { code },
    });
    console.log({ companyFound });
    if (!companyFound) {
      throw new UnauthorizedException('Empresa não cadastrada.');
    }

    (request as any)['company'] = companyFound;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const response = context.switchToHttp().getResponse<FastifyReply>();

    const token: string | undefined = request.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const isExpired = this.isTokenExpired(token);

      if (isExpired) {
        response.clearCookie('access_token');

        throw new UnauthorizedException();
      }

      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token);

      if (payload.nenv !== envConfig.NODE_ENV) {
        throw new UnauthorizedException();
      }

      const session = await this.prisma.session.findUnique({
        where: { id: payload.sid },
      });

      if (!session || !session.isValid || session.expiresAt <= new Date()) {
        throw new UnauthorizedException();
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.uid },
      });

      if (!user || user.deletedAt || user.disabledAt) {
        throw new UnauthorizedException();
      }

      const isAdminOnly = this.reflector.getAllAndOverride<boolean>(
        IS_ADMIN_ONLY_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isAdminOnly && user.type !== UserType.ADMIN) {
        throw new UnauthorizedException();
      }

      await this.prisma.session.update({
        where: { id: payload.sid },
        data: { lastActivity: new Date() },
      });

      (request as any)['user'] = {
        id: payload.uid,
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.jwtService.decode<JwtPayloadDto>(token);
      if (!payload?.exp) return true;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
