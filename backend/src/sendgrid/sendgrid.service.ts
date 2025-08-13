import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from './client';

@Injectable()
export class SendgridService {
  constructor(private readonly sendGridClient: SendGridClient) {}

  async sendEmail(args: MailDataRequired): Promise<void> {
    const mail: MailDataRequired = {
      to: args.to,
      cc: args.cc,
      templateId: args.templateId,
      dynamicTemplateData: args.dynamicTemplateData,
      ...args,
      from: process.env['FROM_EMAIL'] as string,
    };

    await this.sendGridClient.send(mail);
  }
}
