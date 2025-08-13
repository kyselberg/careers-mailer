import express from 'express';
import multer from 'multer';
import { z } from 'zod';

import { sendCareerApplicationEmail } from './email';
// import { externalLogger } from './external-logger';
import { getRecipientEmail } from './forms';
import { CustomError } from './lib/custom-error';
import { logger } from './logger';
import { formDataSchema } from './validation';

// Health check controller
export const healthCheck = (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
};

// Career form submission controller
export const submitCareerForm = async (req: express.Request, res: express.Response) => {
  try {
    // Validate form data
    const validatedData = formDataSchema.parse(req.body);

    // Get recipient email based on form ID
    const recipientEmail = getRecipientEmail(validatedData.formId);

    // Check if CV file is provided
    if (!req.file) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    const cvFile = req.file;

    // Log form submission
    const submissionData = {
      ...validatedData,
      recipientEmail,
      cvFileName: cvFile.originalname,
      cvSize: cvFile.size,
      submittedAt: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    };

    logger.info('New career form submission received', submissionData);

    // Send email with form data and CV attachment
    await sendCareerApplicationEmail({
      validatedData,
      cvFile: {
        originalname: cvFile.originalname,
        buffer: cvFile.buffer,
        size: cvFile.size,
      },
      submittedAt: submissionData.submittedAt,
      recipientEmail,
    });

    // Send external notification
    const externalMessage = `🎯 New Career Application!\n\n📋 Position: ${validatedData.formId}\n👤 Name: ${validatedData.name}\n📧 Email: ${validatedData.email}\n📄 CV: ${cvFile.originalname}\n⏰ ${submissionData.submittedAt}`;
    // await externalLogger.log(externalMessage);

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      submissionId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      formId: validatedData.formId,
    });

  } catch (error: any) {
    logger.error('Error processing form submission:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // Handle invalid form ID errors
    if (error.message && error.message.startsWith('Invalid form ID:')) {
      return res.status(400).json({
        error: 'Invalid form ID',
        message: error.message,
      });
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'CV file size must not exceed 2MB' });
      }
      return res.status(400).json({ error: 'File upload error: ' + error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// 404 handler controller
export const notFound = (req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
};

// Global error handler controller
export const globalErrorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ msg: err.message });
    } else {
      res.status(500).json({ msg: 'Internal server error' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};