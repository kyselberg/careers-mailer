import { db } from '@db';
import { emailsTable } from '@schemas/emails.sql';
import { eq } from 'drizzle-orm';
import { type NextFunction, type Request, type Response } from 'express';
import crypto from 'node:crypto';
import { CustomError } from '../lib/custom-error';

const getAllEmails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const emails = await db.select().from(emailsTable);
        res.json(emails);
    } catch (error) {
        next(new CustomError('Failed to get emails', 500));
    }
};

const createEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const hash = crypto.randomUUID();
    const result = await db.insert(emailsTable).values({ email, hash }).returning();
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to create email', 500));
  }
};

const deleteEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await db.delete(emailsTable).where(eq(emailsTable.id, Number(id)));
    res.json({ msg: 'Email deleted' });
  } catch (error) {
    next(new CustomError('Failed to delete email', 500));
  }
};

export {
  createEmail,
  deleteEmail,
  getAllEmails
};
