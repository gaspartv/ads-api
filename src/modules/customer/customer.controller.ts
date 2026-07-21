import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { IsAdminOnly } from 'src/common/decorators/is_admin_only.decorator';
import { CompanySign } from 'src/common/decorators/company.decorator';
import type { Company } from 'src/generated/prisma/client';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @IsAdminOnly()
  @Get('search')
  searchByWhatsapp(
    @Query('whatsapp') whatsapp: string,
    @CompanySign() company: Company,
  ) {
    if (!whatsapp) return [];
    return this.customerService.searchByWhatsapp(whatsapp, company.id);
  }

  @IsAdminOnly()
  @Post()
  create(@Body() body: CreateCustomerDto, @CompanySign() company: Company) {
    return this.customerService.create({
      ...body,
      companyId: company.id,
    });
  }
}
