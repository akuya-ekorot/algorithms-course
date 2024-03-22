import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type ChapterContentId,
  chapterContentIdSchema,
  chapterContents,
} from '@/lib/db/schema/chapterContents';
import { chapters } from '@/lib/db/schema/chapters';

export const getChapterContents = async () => {
  const rows = await db
    .select({ chapterContent: chapterContents, chapter: chapters })
    .from(chapterContents)
    .leftJoin(chapters, eq(chapterContents.chapterId, chapters.id));
  const c = rows.map((r) => ({ ...r.chapterContent, chapter: r.chapter }));
  return { chapterContents: c };
};

export const getChapterContentById = async (id: ChapterContentId) => {
  const { id: chapterContentId } = chapterContentIdSchema.parse({ id });
  const [row] = await db
    .select({ chapterContent: chapterContents, chapter: chapters })
    .from(chapterContents)
    .where(eq(chapterContents.id, chapterContentId))
    .leftJoin(chapters, eq(chapterContents.chapterId, chapters.id));
  if (row === undefined) return {};
  const c = { ...row.chapterContent, chapter: row.chapter };
  return { chapterContent: c };
};
