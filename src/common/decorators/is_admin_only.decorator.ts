import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_ONLY_KEY = 'isAdminOnly';
export const IsAdminOnly = () => SetMetadata(IS_ADMIN_ONLY_KEY, true);
