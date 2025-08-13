import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/migrations',
  schema: ['./src/schemas/emails.sql.ts'],
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env['DB_FILE_NAME'] || '',
  },
});
