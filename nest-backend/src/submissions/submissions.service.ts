import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EmailsService } from 'src/emails/emails.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly sendgridService: SendgridService,
    private readonly emailsService: EmailsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendSubmissionEmail(
    file: Express.Multer.File,
    createSubmissionDto: CreateSubmissionDto,
  ) {
    console.log(`Sending submission email`,);
    const email = await this.emailsService.getEmailByFormId(
      createSubmissionDto.formId,
    );
    console.log(`Email: ${email}`);

    const positionTitle = await this.emailsService.getEmailPositionTitle(
      createSubmissionDto.formId,
    );
    console.log(`Position Title: ${positionTitle}`);


    await this.sendgridService.sendEmail({
      from: process.env['FROM_EMAIL'] || '',
      to: email,
      subject: `New Career Application from ${createSubmissionDto.name} - ${positionTitle}`,
      html: `
        <h2>New Career Application Received</h2>
        <p><strong>Name:</strong> ${createSubmissionDto.name}</p>
        <p><strong>Email:</strong> ${createSubmissionDto.email}</p>
        <p><strong>Contact Way:</strong> ${createSubmissionDto.contactWay}</p>
        <p><strong>Experience:</strong></p>
        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${createSubmissionDto.experience.replace(/\n/g, '<br>')}
        </div>
      `,
      attachments: [
        {
          content: Buffer.from(file.buffer).toString('base64'),
          filename: 'attachment.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    });
  }
}
