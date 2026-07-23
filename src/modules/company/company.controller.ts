import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CompanyService } from './company.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { CompanySign } from 'src/common/decorators/company.decorator';
import type { Company } from 'src/generated/prisma/client';
import { UpdateCompanyThemeDto } from './dtos/update-company-theme.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @IsPublic()
  @Get('info/:code')
  getInfoByCode(@Param('code') code: string) {
    return this.service.getInfoByCode(code);
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
}
