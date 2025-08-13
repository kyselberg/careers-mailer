import { Module } from '@nestjs/common';
import { SendGridClient } from './client';
import { SendgridService } from './sendgrid.service';

@Module({
  providers: [SendGridClient, SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
