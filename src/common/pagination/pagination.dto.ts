import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  page?: number;

  @IsOptional()
  @IsString()
  limit?: number;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  orderType?: 'asc' | 'desc';
}

export class PaginationResponseDto<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export abstract class PaginationService {
  getPagination(query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const orderBy = query.orderBy || 'createdAt';
    const orderType = query.orderType || 'asc';

    return {
      page,
      limit,
      orderBy,
      orderType,
    };
  }
}
