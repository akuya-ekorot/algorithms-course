import { sql } from 'drizzle-orm';
import { text, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getCourses } from '@/lib/api/courses/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const courses = pgTable('courses', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  repoLink: text('repo_link').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for courses - used to validate API requests
const baseSchema = createSelectSchema(courses).omit(timestamps);

export const insertCourseSchema = createInsertSchema(courses).omit(timestamps);
export const insertCourseParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateCourseSchema = baseSchema;
export const updateCourseParams = baseSchema.extend({});
export const courseIdSchema = baseSchema.pick({ id: true });

// Types for courses - used to type API request params and within Components
export type Course = typeof courses.$inferSelect;
export type NewCourse = z.infer<typeof insertCourseSchema>;
export type NewCourseParams = z.infer<typeof insertCourseParams>;
export type UpdateCourseParams = z.infer<typeof updateCourseParams>;
export type CourseId = z.infer<typeof courseIdSchema>['id'];

// this type infers the return from getCourses() - meaning it will include any joins
export type CompleteCourse = Awaited<
  ReturnType<typeof getCourses>
>['courses'][number];
