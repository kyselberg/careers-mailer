import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

dotenv.config();

const client = createClient({ url: process.env['DB_FILE_NAME'] || '' });

export const db = drizzle({ client });