import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Company } from 'src/generated/prisma/client';

export const CompanySign = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Company => {
    const request = context.switchToHttp().getRequest() as { company: Company };

    return request.company;
  },
);
