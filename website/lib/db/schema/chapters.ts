import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { lessons } from "./lessons";
import { type getChapters } from "@/lib/api/chapters/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const chapters = pgTable("chapters", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  description: text("description").notNull(),
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

// Schema for chapters - used to validate API requests
const baseSchema = createSelectSchema(chapters).omit(timestamps);

export const insertChapterSchema =
  createInsertSchema(chapters).omit(timestamps);
export const insertChapterParams = baseSchema
  .extend({
    lessonId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateChapterSchema = baseSchema;
export const updateChapterParams = baseSchema.extend({
  lessonId: z.coerce.string().min(1),
});
export const chapterIdSchema = baseSchema.pick({ id: true });

// Types for chapters - used to type API request params and within Components
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = z.infer<typeof insertChapterSchema>;
export type NewChapterParams = z.infer<typeof insertChapterParams>;
export type UpdateChapterParams = z.infer<typeof updateChapterParams>;
export type ChapterId = z.infer<typeof chapterIdSchema>["id"];

// this type infers the return from getChapters() - meaning it will include any joins
export type CompleteChapter = Awaited<
  ReturnType<typeof getChapters>
>["chapters"][number];
