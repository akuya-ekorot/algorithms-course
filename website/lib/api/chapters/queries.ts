import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ChapterId,
  chapterIdSchema,
  chapters,
} from '@/lib/db/schema/chapters';
import { lessons } from '@/lib/db/schema/lessons';
import {
  chapterContents,
  type CompleteChapterContent,
} from '@/lib/db/schema/chapterContents';

export const getChapters = async () => {
  const rows = await db
    .select({ chapter: chapters, lesson: lessons })
    .from(chapters)
    .leftJoin(lessons, eq(chapters.lessonId, lessons.id));
  const c = rows.map((r) => ({ ...r.chapter, lesson: r.lesson }));
  return { chapters: c };
};

export const getChapterById = async (id: ChapterId) => {
  const { id: chapterId } = chapterIdSchema.parse({ id });
  const [row] = await db
    .select({ chapter: chapters, lesson: lessons })
    .from(chapters)
    .where(eq(chapters.id, chapterId))
    .leftJoin(lessons, eq(chapters.lessonId, lessons.id));
  if (row === undefined) return {};
  const c = { ...row.chapter, lesson: row.lesson };
  return { chapter: c };
};

export const getChapterByIdWithChapterContents = async (id: ChapterId) => {
  const { id: chapterId } = chapterIdSchema.parse({ id });
  const rows = await db
    .select({ chapter: chapters, chapterContent: chapterContents })
    .from(chapters)
    .where(eq(chapters.id, chapterId))
    .leftJoin(chapterContents, eq(chapters.id, chapterContents.chapterId));
  if (rows.length === 0) return {};
  const c = rows[0].chapter;
  const cc = rows
    .filter((r) => r.chapterContent !== null)
    .map((c) => c.chapterContent) as CompleteChapterContent[];

  return { chapter: c, chapterContents: cc };
};
