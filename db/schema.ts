import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const subscribers = sqliteTable('subscribers', {
  email: text('email').primaryKey(),
  token: text('token').notNull().unique(),
  status: text('status').notNull().default('active'),
  consentAt: text('consent_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  topic: text('topic').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull(),
  status: text('status').notNull().default('new'),
});

export const loginAttempts = sqliteTable('login_attempts', {
  key: text('key').primaryKey(),
  attempts: integer('attempts').notNull().default(0),
  blockedUntil: integer('blocked_until').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
});

export const feedSnapshots = sqliteTable('feed_snapshots', {
  sourceId: text('source_id').primaryKey(),
  itemsJson: text('items_json').notNull(),
  fetchedAt: text('fetched_at'),
  lastAttemptAt: text('last_attempt_at').notNull(),
  lastError: text('last_error'),
});
