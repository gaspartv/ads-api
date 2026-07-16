import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserSignInDto } from './dtos/user.sign-in.dto';
import { decrypt } from 'src/functions/decrypt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from 'src/configs/env.config';
import { UserCreateDto } from './dtos/user.create.dto';
import { generateCode } from 'src/functions/generate-code';
import { FastifyReply } from 'fastify';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(dto: UserCreateDto) {
    const email = await decrypt(dto.emailHash);
    const password = await decrypt(dto.passwordHash);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new ConflictException('Email já cadastrado.');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await this.prisma.user.create({
      data: {
        code: generateCode(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email,
        passwordHash: hashedPassword,
      },
    });

    // !TODO: implementar envio de email para verificação
  }

  async signIn(
    dto: UserSignInDto,
    ip: string,
    agent: string,
    res: FastifyReply,
  ) {
    const email = await decrypt(dto.emailHash);
    const password = await decrypt(dto.passwordHash);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException('Credenciais invalidas.');
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);

    if (!isMatch) {
      throw new ConflictException('Credenciais invalidas.');
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.session.updateMany({
        where: { userId: user.id, isValid: true },
        data: { isValid: false },
      });

      const session = await tx.session.create({
        data: {
          expiresAt: new Date(
            Date.now() + envConfig.SESSION_EXPIRES_IN_DAY * 24 * 60 * 60 * 1000,
          ),
          lastActivity: new Date(),
          ip,
          agent,
          isValid: true,
          userId: user.id,
        },
      });

      const payload = {
        uid: user.id,
        sid: session.id,
        nenv: envConfig.NODE_ENV,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: `${envConfig.SESSION_EXPIRES_IN_DAY}d`,
      });

      const sameSite = envConfig.NODE_ENV === 'production' ? 'none' : 'lax';
      const secure = envConfig.NODE_ENV === 'production';

      res.setCookie('access_token', accessToken, {
        httpOnly: true,
        secure,
        path: '/',
        sameSite,
        maxAge: Math.floor(envConfig.SESSION_EXPIRES_IN_DAY * 24 * 60 * 60),
      });

      return { accessToken };
    });
  }

  async isAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, type: 'ADMIN' },
    });

    return {
      isAdmin: !!user,
    };
  }
}
