import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { lessons } from "./lessons";
import { type getLessonReferences } from "@/lib/api/lessonReferences/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const lessonReferences = pgTable("lesson_references", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  link: text("link"),
  lessonId: varchar("lesson_id", { length: 256 })
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for lessonReferences - used to validate API requests
const baseSchema = createSelectSchema(lessonReferences).omit(timestamps);

export const insertLessonReferenceSchema =
  createInsertSchema(lessonReferences).omit(timestamps);
export const insertLessonReferenceParams = baseSchema
  .extend({
    lessonId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateLessonReferenceSchema = baseSchema;
export const updateLessonReferenceParams = baseSchema.extend({
  lessonId: z.coerce.string().min(1),
});
export const lessonReferenceIdSchema = baseSchema.pick({ id: true });

// Types for lessonReferences - used to type API request params and within Components
export type LessonReference = typeof lessonReferences.$inferSelect;
export type NewLessonReference = z.infer<typeof insertLessonReferenceSchema>;
export type NewLessonReferenceParams = z.infer<
  typeof insertLessonReferenceParams
>;
export type UpdateLessonReferenceParams = z.infer<
  typeof updateLessonReferenceParams
>;
export type LessonReferenceId = z.infer<typeof lessonReferenceIdSchema>["id"];

// this type infers the return from getLessonReferences() - meaning it will include any joins
export type CompleteLessonReference = Awaited<
  ReturnType<typeof getLessonReferences>
>["lessonReferences"][number];
