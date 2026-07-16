import { IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  emailHash: string;

  @IsString()
  passwordHash: string;
}
