import { Controller, Get, Query } from '@nestjs/common';
import { decrypt } from 'src/functions/decrypt';
import { encrypt } from 'src/functions/encrypt';
import { IsPublic } from 'src/common/decorators/is_public.decorator';
import * as bcrypt from 'bcrypt';

@Controller('log')
export class LogController {
  constructor() {}

  @IsPublic()
  @Get('test1')
  test1(@Query() query: { text: string }) {
    return encrypt(query.text);
  }

  @IsPublic()
  @Get('test2')
  test2(@Query() query: { text: string }) {
    return decrypt(query.text);
  }
  @IsPublic()
  @Get('test3')
  test3(@Query() query: { text: string }) {
    return bcrypt.hashSync(query.text, 10);
  }
}
