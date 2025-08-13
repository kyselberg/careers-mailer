import { Module } from '@nestjs/common';
import { EmailsModule } from 'src/emails/emails.module';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  imports: [EmailsModule, SendgridModule],
})
export class SubmissionsModule {}
