import nodemailer from 'nodemailer';
import { logger } from './logger';
import type { FormData } from './validation';

export const createTransporter = () => {
  const config = {
    host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
    port: parseInt(process.env['SMTP_PORT'] || '587'),
    secure: process.env['SMTP_SECURE'] === 'true',
    auth: {
      user: process.env['SMTP_USER'],
      pass: process.env['SMTP_PASS'],
    },
  };

  if (!config.auth.user || !config.auth.pass) {
    throw new Error('SMTP credentials not provided in environment variables');
  }

  return nodemailer.createTransport(config);
};

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
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env['SMTP_USER'],
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
        filename: cvFile.originalname,
        content: cvFile.buffer,
        contentType: 'application/pdf',
      },
    ],
  };

  const emailResult = await transporter.sendMail(mailOptions);
  logger.info('Email sent successfully', {
    messageId: emailResult.messageId,
    to: recipientEmail,
    formId: validatedData.formId,
    applicantName: validatedData.name,
  });

  return emailResult;
};