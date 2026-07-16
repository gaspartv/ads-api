import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { envConfig } from 'src/configs/env.config';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.headers['sk'] !== envConfig.APP_SECRET_KEY) {
      throw new UnauthorizedException('SK de API invalido.');
    }

    return true;
  }
}
