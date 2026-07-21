import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminSystemService } from './admin-system.service';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { AdminSystemCompanyCreateDto } from './dtos/company/company.create.dto';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

@UseGuards(AuthAdminGuard)
@IsPublic()
@Controller('admin-system')
export class AdminSystemController {
  constructor(private readonly service: AdminSystemService) {}

  @Post('company/create')
  createCompany(@Body() body: AdminSystemCompanyCreateDto) {
    return this.service.companyCreate(body);
  }
}
