import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { envConfig } from 'src/configs/env.config';

export interface ISendEmailParams {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly resendClient: Resend;

  constructor() {
    this.resendClient = new Resend(envConfig.RESEND_API_KEY);
  }

  async send({ from, to, subject, html }: ISendEmailParams) {
    const { data, error } = await this.resendClient.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Erro ao enviar email para ${to.join(', ')}: ${error.message}`, error);

      throw new BadGatewayException('Erro ao enviar email.');
    }

    return data;
  }
}
