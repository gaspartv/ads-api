import { Controller, Get, Req } from '@nestjs/common';
import { InfoService } from './info.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import { CompanySign } from 'src/common/decorators/company.decorator';
import type { Company } from 'src/generated/prisma/client';

@IsPublic()
@Controller('info')
export class InfoController {
  constructor(private readonly service: InfoService) {}

  @Get('list/worlds')
  listWorlds() {
    return this.service.listWorlds();
  }

  @Get('list/charms')
  listCharms() {
    return this.service.listCharms();
  }

  @Get('list/outfits')
  listOutfits() {
    return this.service.listOutfits();
  }

  @Get('list/mounts')
  listMounts() {
    return this.service.listMounts();
  }

  @Get('list/modules')
  listModules(@CompanySign() company: Company) {
    return this.service.listModules(company.id);
  }
}
