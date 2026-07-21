import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/generated/prisma/client';

export const UserSign = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest() as { user: User };

    return request.user;
  },
);
