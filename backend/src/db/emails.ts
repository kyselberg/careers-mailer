import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const emailsTable = sqliteTable('emails', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  hash: text('hash').notNull().unique(),
});
