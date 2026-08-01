import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { CompanySign } from 'src/common/decorators/company.decorator';
import type { Company } from 'src/generated/prisma/client';
import { UpdateCompanyThemeDto } from './dtos/update-company-theme.dto';
import type { FastifyRequest } from 'fastify';

@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @IsPublic()
  @Get('info/:code')
  getInfoByCode(@Param('code') code: string) {
    return this.service.getInfoByCode(code);
  }

  @IsPublic()
  @Get('info/:code/contact')
  getContact(@Param('code') code: string) {
    return this.service.getInfoContact(code);
  }

  @IsAdminOnly()
  @Patch('edit')
  edit(@CompanySign() company: Company, @Body() body: any) {
    return this.service.edit(company.id, body);
  }

  @IsAdminOnly()
  @Get('my')
  my(@CompanySign() company: Company) {
    return this.service.my(company.id);
  }

  @IsAdminOnly()
  @Patch('theme')
  updateTheme(
    @CompanySign() company: Company,
    @Body() body: UpdateCompanyThemeDto,
  ) {
    return this.service.updateTheme(company.id, body);
  }

  @IsAdminOnly()
  @Post('upload/logo')
  uploadLogo(
    @Req() req: FastifyRequest,
    @CompanySign() company: Company,
  ) {
    return this.service.uploadLogo(company.id, req);
  }

  @IsAdminOnly()
  @Post('upload/favicon')
  uploadFavicon(
    @Req() req: FastifyRequest,
    @CompanySign() company: Company,
  ) {
    return this.service.uploadFavicon(company.id, req);
  }

  @IsAdminOnly()
  @Post('upload/banner')
  uploadBanner(
    @Req() req: FastifyRequest,
    @CompanySign() company: Company,
  ) {
    return this.service.uploadBanner(company.id, req);
  }
}
