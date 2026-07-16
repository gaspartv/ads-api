import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './company.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @IsPublic()
  @Get('info/:code')
  async getInfoByCode(@Param('code') code: string) {
    return this.service.getInfoByCode(code);
  }
}
