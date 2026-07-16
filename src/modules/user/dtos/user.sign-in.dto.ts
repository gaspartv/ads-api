import { IsString } from 'class-validator';

export class UserSignInDto {
  @IsString()
  emailHash: string;

  @IsString()
  passwordHash: string;
}
