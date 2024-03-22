import { sql } from 'drizzle-orm';
import {
  text,
  integer,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { courses } from './courses';
import { type getCourseObjectives } from '@/lib/api/courseObjectives/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const courseObjectives = pgTable('course_objectives', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  objective: text('objective').notNull(),
  rank: integer('rank').notNull(),
  courseId: varchar('course_id', { length: 256 })
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for courseObjectives - used to validate API requests
const baseSchema = createSelectSchema(courseObjectives).omit(timestamps);

export const insertCourseObjectiveSchema =
  createInsertSchema(courseObjectives).omit(timestamps);
export const insertCourseObjectiveParams = baseSchema
  .extend({
    rank: z.coerce.number(),
    courseId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateCourseObjectiveSchema = baseSchema;
export const updateCourseObjectiveParams = baseSchema.extend({
  rank: z.coerce.number(),
  courseId: z.coerce.string().min(1),
});
export const courseObjectiveIdSchema = baseSchema.pick({ id: true });

// Types for courseObjectives - used to type API request params and within Components
export type CourseObjective = typeof courseObjectives.$inferSelect;
export type NewCourseObjective = z.infer<typeof insertCourseObjectiveSchema>;
export type NewCourseObjectiveParams = z.infer<
  typeof insertCourseObjectiveParams
>;
export type UpdateCourseObjectiveParams = z.infer<
  typeof updateCourseObjectiveParams
>;
export type CourseObjectiveId = z.infer<typeof courseObjectiveIdSchema>['id'];

// this type infers the return from getCourseObjectives() - meaning it will include any joins
export type CompleteCourseObjective = Awaited<
  ReturnType<typeof getCourseObjectives>
>['courseObjectives'][number];
