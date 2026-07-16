import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  Body,
  HttpException,
  HttpStatus,
  Header,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ReportsService, TransactionRow } from './reports.service';
import { IsPublic } from 'src/common/decorators/is_public.decorator';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @IsPublic()
  @Post('parse-pdf')
  async parsePdf(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    if (!req.isMultipart()) {
      throw new HttpException(
        'Request must be multipart/form-data',
        HttpStatus.BAD_REQUEST,
      );
    }

    let fileBuffer: Buffer | null = null;
    let minSalePrice: number | null = null;
    let maxSalePrice: number | null = null;
    let minBuyPrice: number | null = null;
    let maxBuyPrice: number | null = null;

    try {
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          if (part.fieldname === 'file') {
            fileBuffer = await part.toBuffer();
            if (part.mimetype !== 'application/pdf') {
              throw new HttpException(
                'File must be a PDF',
                HttpStatus.BAD_REQUEST,
              );
            }
          }
        } else {
          if (part.fieldname === 'minSalePrice') {
            minSalePrice = parseFloat(part.value as string);
          } else if (part.fieldname === 'maxSalePrice') {
            maxSalePrice = parseFloat(part.value as string);
          } else if (part.fieldname === 'minBuyPrice') {
            minBuyPrice = parseFloat(part.value as string);
          } else if (part.fieldname === 'maxBuyPrice') {
            maxBuyPrice = parseFloat(part.value as string);
          }
        }
      }
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Error parsing multipart request',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!fileBuffer) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    if (
      !minSalePrice || isNaN(minSalePrice) || minSalePrice <= 0 ||
      !maxSalePrice || isNaN(maxSalePrice) || maxSalePrice < minSalePrice ||
      !minBuyPrice || isNaN(minBuyPrice) || minBuyPrice <= 0 ||
      !maxBuyPrice || isNaN(maxBuyPrice) || maxBuyPrice < minBuyPrice
    ) {
      throw new HttpException(
        'Os preços mínimos e máximos devem ser válidos e coerentes',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const rows = await this.reportsService.parsePdfToData(
        fileBuffer,
        minSalePrice,
        maxSalePrice,
        minBuyPrice,
        maxBuyPrice,
      );

      res.send({ success: true, rows });
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Error processing the PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @IsPublic()
  @Post('generate-excel-from-json')
  async generateExcelFromJson(@Body() body: { rows: TransactionRow[] }, @Res() res: FastifyReply) {
    if (!body || !body.rows || !Array.isArray(body.rows)) {
      throw new HttpException('Payload inválido. Array de rows é obrigatório.', HttpStatus.BAD_REQUEST);
    }

    try {
      const excelBuffer = await this.reportsService.generateExcelFromData(body.rows);

      res.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.header(
        'Content-Disposition',
        'attachment; filename=transferencias.xlsx',
      );
      res.header('X-Content-Type-Options', 'nosniff');

      res.send(excelBuffer);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Error generating Excel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
