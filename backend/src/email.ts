import sgMail from '@sendgrid/mail';
import { logger } from './logger';
import type { FormData } from './validation';


export interface EmailOptions {
  validatedData: FormData;
  cvFile: {
    originalname: string;
    buffer: Buffer;
    size: number;
  };
  submittedAt: string;
  recipientEmail: string;
}

export const sendCareerApplicationEmail = async (options: EmailOptions) => {
  const { validatedData, cvFile, submittedAt, recipientEmail } = options;

  const emailResult = await sgMail.send({
    from: process.env['FROM_EMAIL'] || '',
    to: recipientEmail,
    subject: `New Career Application from ${validatedData.name} - ${validatedData.formId}`,
    html: `
      <h2>New Career Application Received</h2>
      <p><strong>Position:</strong> ${validatedData.formId}</p>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Preferred Contact Way:</strong> ${validatedData.contactWay}</p>
      <p><strong>Experience:</strong></p>
      <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
        ${validatedData.experience.replace(/\n/g, '<br>')}
      </div>
      <p><strong>CV File:</strong> ${cvFile.originalname} (${(cvFile.size / 1024).toFixed(2)} KB)</p>
      <p><strong>Submitted At:</strong> ${submittedAt}</p>
    `,
    attachments: [
      {
        content: cvFile.buffer.toString('base64'),
        filename: "attachment.pdf",
        type: "application/pdf",
        disposition: "attachment"
      }
    ]
  });

  logger.info('Email sent successfully', {
    to: recipientEmail,
    formId: validatedData.formId,
    applicantName: validatedData.name,
  });

  return emailResult;
};