import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserSignInDto } from './dtos/user.sign-in.dto';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserCreateDto } from './dtos/user.create.dto';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { UserSign } from 'src/common/decorators/user.decorator';
import type { User } from 'src/generated/prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @IsPublic()
  @UseGuards(AuthAdminGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: UserCreateDto, @Req() req: FastifyRequest) {
    return this.service.create(body, (req as any).company.id);
  }

  @IsPublic()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() body: UserSignInDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const companyId = (req as any).company.id;
    return this.service.signIn(body, companyId, ip, userAgent, res);
  }

  @Get('is-admin')
  @HttpCode(HttpStatus.OK)
  isAdmin(@UserSign() user: User) {
    return this.service.isAdmin(user.id);
  }

  @Get('is-valid-auth')
  @HttpCode(HttpStatus.OK)
  isValidAuth() {
    return { isValid: true };
  }
}
