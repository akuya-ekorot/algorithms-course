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
import { lessons } from './lessons';
import { type getLessonObjectives } from '@/lib/api/lessonObjectives/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const lessonObjectives = pgTable('lesson_objectives', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  objective: text('objective').notNull(),
  rank: integer('rank').notNull(),
  lessonId: varchar('lesson_id', { length: 256 })
    .references(() => lessons.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for lessonObjectives - used to validate API requests
const baseSchema = createSelectSchema(lessonObjectives).omit(timestamps);

export const insertLessonObjectiveSchema =
  createInsertSchema(lessonObjectives).omit(timestamps);
export const insertLessonObjectiveParams = baseSchema
  .extend({
    rank: z.coerce.number(),
    lessonId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateLessonObjectiveSchema = baseSchema;
export const updateLessonObjectiveParams = baseSchema.extend({
  rank: z.coerce.number(),
  lessonId: z.coerce.string().min(1),
});
export const lessonObjectiveIdSchema = baseSchema.pick({ id: true });

// Types for lessonObjectives - used to type API request params and within Components
export type LessonObjective = typeof lessonObjectives.$inferSelect;
export type NewLessonObjective = z.infer<typeof insertLessonObjectiveSchema>;
export type NewLessonObjectiveParams = z.infer<
  typeof insertLessonObjectiveParams
>;
export type UpdateLessonObjectiveParams = z.infer<
  typeof updateLessonObjectiveParams
>;
export type LessonObjectiveId = z.infer<typeof lessonObjectiveIdSchema>['id'];

// this type infers the return from getLessonObjectives() - meaning it will include any joins
export type CompleteLessonObjective = Awaited<
  ReturnType<typeof getLessonObjectives>
>['lessonObjectives'][number];
