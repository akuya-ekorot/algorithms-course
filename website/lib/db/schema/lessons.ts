import { sql } from 'drizzle-orm';
import {
  text,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { courses } from './courses';
import { type getLessons } from '@/lib/api/lessons/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const lessons = pgTable(
  'lessons',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: text('title').notNull(),
    description: text('description').notNull(),
    rank: text('rank').notNull(),
    courseId: varchar('course_id', { length: 256 })
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (lessons) => {
    return {
      rankIndex: uniqueIndex('lessons_rank_idx').on(lessons.rank),
    };
  },
);

// Schema for lessons - used to validate API requests
const baseSchema = createSelectSchema(lessons).omit(timestamps);

export const insertLessonSchema = createInsertSchema(lessons).omit(timestamps);
export const insertLessonParams = baseSchema
  .extend({
    courseId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateLessonSchema = baseSchema;
export const updateLessonParams = baseSchema.extend({
  courseId: z.coerce.string().min(1),
});
export const lessonIdSchema = baseSchema.pick({ id: true });

// Types for lessons - used to type API request params and within Components
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = z.infer<typeof insertLessonSchema>;
export type NewLessonParams = z.infer<typeof insertLessonParams>;
export type UpdateLessonParams = z.infer<typeof updateLessonParams>;
export type LessonId = z.infer<typeof lessonIdSchema>['id'];

// this type infers the return from getLessons() - meaning it will include any joins
export type CompleteLesson = Awaited<
  ReturnType<typeof getLessons>
>['lessons'][number];
