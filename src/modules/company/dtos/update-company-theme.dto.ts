import { IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ThemeColorPaletteDto {
  @IsOptional()
  @IsString()
  background?: string;

  @IsOptional()
  @IsString()
  foreground?: string;

  @IsOptional()
  @IsString()
  card?: string;

  @IsOptional()
  @IsString()
  cardForeground?: string;

  @IsOptional()
  @IsString()
  popover?: string;

  @IsOptional()
  @IsString()
  popoverForeground?: string;

  @IsOptional()
  @IsString()
  primary?: string;

  @IsOptional()
  @IsString()
  primaryForeground?: string;

  @IsOptional()
  @IsString()
  secondary?: string;

  @IsOptional()
  @IsString()
  secondaryForeground?: string;

  @IsOptional()
  @IsString()
  muted?: string;

  @IsOptional()
  @IsString()
  mutedForeground?: string;

  @IsOptional()
  @IsString()
  accent?: string;

  @IsOptional()
  @IsString()
  accentForeground?: string;

  @IsOptional()
  @IsString()
  destructive?: string;

  @IsOptional()
  @IsString()
  destructiveForeground?: string;

  @IsOptional()
  @IsString()
  border?: string;

  @IsOptional()
  @IsString()
  input?: string;

  @IsOptional()
  @IsString()
  ring?: string;

  @IsOptional()
  @IsString()
  sidebar?: string;

  @IsOptional()
  @IsString()
  sidebarForeground?: string;

  @IsOptional()
  @IsString()
  sidebarPrimary?: string;

  @IsOptional()
  @IsString()
  sidebarPrimaryForeground?: string;

  @IsOptional()
  @IsString()
  sidebarAccent?: string;

  @IsOptional()
  @IsString()
  sidebarAccentForeground?: string;

  @IsOptional()
  @IsString()
  sidebarBorder?: string;

  @IsOptional()
  @IsString()
  sidebarRing?: string;
}

export class UpdateCompanyThemeDto {
  @IsOptional()
  @IsObject()
  @Type(() => ThemeColorPaletteDto)
  light?: ThemeColorPaletteDto;

  @IsOptional()
  @IsObject()
  @Type(() => ThemeColorPaletteDto)
  dark?: ThemeColorPaletteDto;

  @IsOptional()
  @IsString()
  radius?: string;
}
