import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const createEmailSchema = z.object({
  title: z.string({error: 'Title is required'}).min(1).max(100),
  email: z.string({error: 'Email is required'}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).min(1),
});

export const deleteEmailSchema = z.object({
  id: z.number(),
});

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = await createEmailSchema.safeParseAsync(req.body);
  if (error) {
    return next(new Error(error.message));
  }
  next();
};

export const validateDeleteEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = await deleteEmailSchema.safeParseAsync(req.params);
  if (error) {
    return next(new Error(error.message));
  }
  next();
};