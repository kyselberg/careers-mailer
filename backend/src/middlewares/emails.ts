import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../logger';

export const createEmailSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).min(1),
});

export const deleteEmailSchema = z.object({
  id: z.number(),
});

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Validating email: ${req.body}`);
  const { error, data } = await createEmailSchema.safeParseAsync(req.body);
  logger.info(`Validation result: ${error ? 'error' : 'success'}`);
  if (error) {
    return next(new Error(error.message));
  }
  logger.info(`Data: ${JSON.stringify(data)}`);
  next();
};

export const validateDeleteEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { error, data } = await deleteEmailSchema.safeParseAsync(req.params);
  if (error) {
    return next(new Error(error.message));
  }
  next();
};