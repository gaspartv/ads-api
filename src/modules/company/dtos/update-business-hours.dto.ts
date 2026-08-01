import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BusinessHourDayDto {
  @IsBoolean()
  isOpen: boolean;

  @IsString()
  @IsOptional()
  open?: string;

  @IsString()
  @IsOptional()
  close?: string;
}

export class UpdateBusinessHoursDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHourDayDto)
  monday?: BusinessHourDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHourDayDto)
  tuesday?: BusinessHourDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHourDayDto)
  wednesday?: BusinessHourDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHourDayDto)
  thursday?: BusinessHourDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHourDayDto)
  friday?: BusinessHourDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHourDayDto)
  saturday?: BusinessHourDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHourDayDto)
  sunday?: BusinessHourDayDto;
}
