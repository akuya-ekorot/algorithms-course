import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { chapters } from "./chapters";
import { type getChapterContents } from "@/lib/api/chapterContents/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const chapterContents = pgTable("chapter_contents", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  type: text("type").notNull(),
  content: text("content").notNull(),
  caption: text("caption"),
  chapterId: varchar("chapter_id", { length: 256 })
    .references(() => chapters.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for chapterContents - used to validate API requests
const baseSchema = createSelectSchema(chapterContents).omit(timestamps);

export const insertChapterContentSchema =
  createInsertSchema(chapterContents).omit(timestamps);
export const insertChapterContentParams = baseSchema
  .extend({
    chapterId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateChapterContentSchema = baseSchema;
export const updateChapterContentParams = baseSchema.extend({
  chapterId: z.coerce.string().min(1),
});
export const chapterContentIdSchema = baseSchema.pick({ id: true });

// Types for chapterContents - used to type API request params and within Components
export type ChapterContent = typeof chapterContents.$inferSelect;
export type NewChapterContent = z.infer<typeof insertChapterContentSchema>;
export type NewChapterContentParams = z.infer<
  typeof insertChapterContentParams
>;
export type UpdateChapterContentParams = z.infer<
  typeof updateChapterContentParams
>;
export type ChapterContentId = z.infer<typeof chapterContentIdSchema>["id"];

// this type infers the return from getChapterContents() - meaning it will include any joins
export type CompleteChapterContent = Awaited<
  ReturnType<typeof getChapterContents>
>["chapterContents"][number];
