import { pgTable, uuid, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';

export interface Project {
  id: string
  name: string
  repository: string
  code: string | null
  status: string
  issues: number
  lastScan: Date | null
}

export interface CreateProjectData {
  name: string
  code: string
  repository: string
}

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  repository: varchar('repository', { length: 255 }).notNull(),
  code: text('code'),
  lastScan: timestamp('last_scan').defaultNow(),
  status: varchar('status', { length: 50 }).default('pending'),
  issues: integer('issues').default(0)
});

export const scans = pgTable('scans', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  status: varchar('status', { length: 50 }).default('pending'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at')
});

export const vulnerabilities = pgTable('vulnerabilities', {
  id: uuid('id').primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  title: varchar('title', { length: 255 }).notNull(),
  severity: varchar('severity', { length: 50 }).notNull(),
  description: text('description'),
  code: text('code'),
  location: varchar('location', { length: 255 }),
  status: varchar('status', { length: 50 }).default('open'),
  createdAt: timestamp('created_at').defaultNow()
})