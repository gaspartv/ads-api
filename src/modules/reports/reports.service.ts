import { Injectable, Logger } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import * as ExcelJS from 'exceljs';

export interface TransactionRow {
  data: string;
  documento: string;
  historico: string;
  loteSaida: number | null;
  loteEntrada: number | null;
  valorSaida: number | null;
  valorEntrada: number | null;
  precoLote: number | null;
  observacao: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  async parsePdfToData(
    fileBuffer: Buffer,
    minSalePrice: number,
    maxSalePrice: number,
    minBuyPrice: number,
    maxBuyPrice: number,
  ): Promise<TransactionRow[]> {
    let pdfData;
    try {
      const parser = new PDFParse({ data: fileBuffer });
      pdfData = await parser.getText();
    } catch (err) {
      this.logger.error('Failed to parse PDF', err);
      throw new Error('O formato do extrato não pôde ser processado.');
    }

    const text = pdfData.text;
    const lines = text.split(/\r?\n/);

    const rows: TransactionRow[] = [];
    const transactions: {
      dateStr: string;
      valueRaw: string;
      restOfLine: string;
      historicoLines: string[];
    }[] = [];

    let currentTx: any = null;
    const transactionStartRegex = /^(\d{2}\/\d{2}\/\d{2,4})\s+([+-]?\s*(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}\s*(?:\([+-]\)|[+-CDcd])?)\s*(.*?)$/i;

    for (const line of lines) {
      const startMatch = line.trim().match(transactionStartRegex);
      if (startMatch) {
        if (currentTx) {
          transactions.push(currentTx);
        }
        currentTx = {
          dateStr: startMatch[1],
          valueRaw: startMatch[2],
          restOfLine: startMatch[3],
          historicoLines: []
        };
      } else {
        if (currentTx && line.trim() !== '') {
          const l = line.trim();
          if (
            !l.includes('--') &&
            !l.toLowerCase().includes('extrato de conta') &&
            !l.toLowerCase().includes('lançamentos') &&
            !l.toLowerCase().includes('cliente ') &&
            !l.toLowerCase().includes('agência:') &&
            !l.toLowerCase().includes('dia documento')
          ) {
            currentTx.historicoLines.push(l);
          }
        }
      }
    }
    if (currentTx) {
      transactions.push(currentTx);
    }

    for (const tx of transactions) {
      let dateStr = tx.dateStr;
      if (dateStr.length === 8 && !dateStr.includes('/')) {
        dateStr = `${dateStr.substring(0, 2)}/${dateStr.substring(2, 4)}/${dateStr.substring(4, 8)}`;
      }

      const fullText = [tx.restOfLine, ...tx.historicoLines].filter(Boolean).join(' ');
      
      const middleParts = fullText.trim().split(/\s+/);
      let documento = '';
      let historico = fullText;

      if (
        middleParts.length >= 3 &&
        /^\d+$/.test(middleParts[0]) &&
        /^\d+$/.test(middleParts[1])
      ) {
        documento = middleParts[1];
        historico = middleParts.slice(2).join(' ');
      } else if (middleParts.length >= 2 && /^\d+$/.test(middleParts[0])) {
        documento = middleParts[0];
        historico = middleParts.slice(1).join(' ');
      }

      if (historico.toLowerCase().includes('saldo')) continue;
      if (
        historico.toLowerCase().includes('poupança') ||
        historico.toLowerCase().includes('poupanca')
      )
        continue;

      let valueStr = tx.valueRaw.replace(/\s+/g, '');
      let isSaida = false;
      let isEntrada = false;

      if (valueStr.includes('-') || valueStr.toUpperCase().includes('D')) {
        isSaida = true;
      } else if (valueStr.includes('+') || valueStr.toUpperCase().includes('C')) {
        isEntrada = true;
      } else {
        if (
          historico.toLowerCase().includes('enviado') ||
          historico.toLowerCase().includes('saída') ||
          historico.toLowerCase().includes('saida') ||
          historico.toLowerCase().includes('compra') ||
          historico.toLowerCase().includes('pagamento') ||
          historico.toLowerCase().includes('saque')
        ) {
          isSaida = true;
        } else {
          isEntrada = true;
        }
      }

      const cleanValueStr = valueStr.replace(/[^\d,]/g, '').replace(',', '.');
      const valor = parseFloat(cleanValueStr);

      if (isNaN(valor)) continue;

      let loteEntrada: number | null = null;
      let loteSaida: number | null = null;
      let valorEntrada: number | null = null;
      let valorSaida: number | null = null;
      let precoLote: number | null = null;
      let observacao = '';

      const checkLote = (val: number, minPrice: number, maxPrice: number) => {
        const minLotes = val / maxPrice;
        const maxLotes = val / minPrice;
        
        let possibleLotes: number[] = [];
        const minK = Math.ceil(minLotes);
        const maxK = Math.floor(maxLotes);

        for (let k = minK; k <= maxK; k++) {
          if (k > 0) {
            possibleLotes.push(k);
          }
        }
        
        const exactLotes = possibleLotes.filter((k) => {
          const price = val / k;
          return Math.abs(price - Math.round(price * 100) / 100) < Number.EPSILON * 1000;
        });

        if (exactLotes.length === 1) {
           const k = exactLotes[0];
           const price = val / k;
           return { lote: k * 250, price };
        }
        
        return null;
      };

      if (isSaida) {
        valorSaida = valor;
        const result = checkLote(valor, minBuyPrice, maxBuyPrice);
        if (result) {
          loteEntrada = result.lote; // Money OUT = Lotes IN
          precoLote = result.price;
        } else {
          observacao = 'Verificação manual';
        }
      } else {
        valorEntrada = valor;
        const result = checkLote(valor, minSalePrice, maxSalePrice);
        if (result) {
          loteSaida = result.lote; // Money IN = Lotes OUT
          precoLote = result.price;
        } else {
          observacao = 'Verificação manual';
        }
      }

      rows.push({
        data: dateStr,
        documento,
        historico,
        loteSaida,
        loteEntrada,
        valorSaida,
        valorEntrada,
        precoLote,
        observacao,
      });
    }

    return rows;
  }

  async generateExcelFromData(rows: TransactionRow[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transferências');

    // Dashboard
    worksheet.addRow(['Dashboard Financeiro']).font = { bold: true, size: 14 };
    
    // As fórmulas abrangerão da linha 15 (dados) até a linha 5000 (suficiente para vários extratos)
    worksheet.addRow(['Total de Transações de Vendas (Recebimentos):']).getCell(2).value = { formula: 'COUNT(G15:G5000)' };
    worksheet.addRow(['Total de Transações de Compras (Pagamentos):']).getCell(2).value = { formula: 'COUNT(F15:F5000)' };
    
    worksheet.addRow(['Preço médio de Vendas (Tibia Coins):']).getCell(2).value = { formula: 'IF(SUM(D15:D5000)>0, SUM(G15:G5000)/(SUM(D15:D5000)/250), 0)' };
    worksheet.addRow(['Preço médio de Compras (Tibia Coins):']).getCell(2).value = { formula: 'IF(SUM(E15:E5000)>0, SUM(F15:F5000)/(SUM(E15:E5000)/250), 0)' };
    
    worksheet.addRow(['Total de Tibia Coins de Compras:']).getCell(2).value = { formula: 'SUM(E15:E5000)' };
    worksheet.addRow(['Total de Tibia Coins de Vendas:']).getCell(2).value = { formula: 'SUM(D15:D5000)' };
    worksheet.addRow(['Saldo de Tibia Coins (Estoque):']).getCell(2).value = { formula: 'B6-B7' };
    
    worksheet.addRow(['Saldo total de Vendas R$:']).getCell(2).value = { formula: 'SUM(G15:G5000)' };
    worksheet.addRow(['Saldo total de Compras R$:']).getCell(2).value = { formula: 'SUM(F15:F5000)' };
    worksheet.addRow(['Saldo do total R$:']).getCell(2).value = { formula: 'B9-B10' };
    
    worksheet.addRow(['Lucro/Prejuízo Realizado R$:']).getCell(2).value = { formula: '(B7/250)*(B4-B5)' };
    
    // Formatting number formats for dashboard
    worksheet.getCell('B2').numFmt = '#,##0';
    worksheet.getCell('B3').numFmt = '#,##0';
    worksheet.getCell('B4').numFmt = '#,##0.00';
    worksheet.getCell('B5').numFmt = '#,##0.00';
    worksheet.getCell('B6').numFmt = '#,##0';
    worksheet.getCell('B7').numFmt = '#,##0';
    worksheet.getCell('B8').numFmt = '#,##0';
    worksheet.getCell('B9').numFmt = '#,##0.00';
    worksheet.getCell('B10').numFmt = '#,##0.00';
    worksheet.getCell('B11').numFmt = '#,##0.00';
    worksheet.getCell('B12').numFmt = '#,##0.00';
    
    for (let i = 2; i <= 12; i++) {
      worksheet.getRow(i).getCell(1).font = { bold: true };
    }

    worksheet.addRow([]); // Blank row
    
    // Tabela Headers (Row 14)
    const headers = [
      'Data', 'Documento', 'Histórico', 'Vendas Tibia Coins', 'Compras Tibia Coins', 
      'Valor Compras', 'Valor Vendas', 'Preço Tibia Coins', 'Observação'
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };

    const columnsConfig = [
      { key: 'data', width: 12 },
      { key: 'documento', width: 20 },
      { key: 'historico', width: 80 },
      { key: 'loteSaida', width: 15 },
      { key: 'loteEntrada', width: 15 },
      { key: 'valorSaida', width: 15 },
      { key: 'valorEntrada', width: 15 },
      { key: 'precoLote', width: 15 },
      { key: 'observacao', width: 25 },
    ];
    
    columnsConfig.forEach((col, idx) => {
      worksheet.getColumn(idx + 1).key = col.key;
      worksheet.getColumn(idx + 1).width = col.width;
    });

    worksheet.autoFilter = {
      from: 'A14',
      to: 'I14',
    };

    for (const row of rows) {
      const addedRow = worksheet.addRow(row);

      // Formatting
      addedRow.getCell('valorSaida').numFmt = '#,##0.00';
      addedRow.getCell('valorEntrada').numFmt = '#,##0.00';
      addedRow.getCell('precoLote').numFmt = '#,##0.00';
      addedRow.getCell('loteSaida').numFmt = '0';
      addedRow.getCell('loteEntrada').numFmt = '0';
      
      addedRow.getCell('historico').alignment = { wrapText: true };

      if (row.observacao === 'Verificação manual') {
        addedRow.getCell('observacao').font = {
          color: { argb: 'FFFF0000' },
          bold: true,
        };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // Helper method backwards compatibility if needed
  async generateTibiaCoinsExcel(
    fileBuffer: Buffer,
    minSalePrice: number,
    maxSalePrice: number,
    minBuyPrice: number,
    maxBuyPrice: number,
  ): Promise<Buffer> {
    const rows = await this.parsePdfToData(fileBuffer, minSalePrice, maxSalePrice, minBuyPrice, maxBuyPrice);
    return this.generateExcelFromData(rows);
  }
}
