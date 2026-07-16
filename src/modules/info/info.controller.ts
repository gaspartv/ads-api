import { Controller, Get } from '@nestjs/common';
import { InfoService } from './info.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

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
}
