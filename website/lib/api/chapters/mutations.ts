import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  ChapterId,
  NewChapterParams,
  UpdateChapterParams,
  updateChapterSchema,
  insertChapterSchema,
  chapters,
  chapterIdSchema,
} from '@/lib/db/schema/chapters';

export const createChapter = async (chapter: NewChapterParams) => {
  const newChapter = insertChapterSchema.parse(chapter);
  try {
    const [c] = await db.insert(chapters).values(newChapter).returning();
    return { chapter: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateChapter = async (
  id: ChapterId,
  chapter: UpdateChapterParams,
) => {
  const { id: chapterId } = chapterIdSchema.parse({ id });
  const newChapter = updateChapterSchema.parse(chapter);
  try {
    const [c] = await db
      .update(chapters)
      .set({ ...newChapter, updatedAt: new Date() })
      .where(eq(chapters.id, chapterId!))
      .returning();
    return { chapter: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteChapter = async (id: ChapterId) => {
  const { id: chapterId } = chapterIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(chapters)
      .where(eq(chapters.id, chapterId!))
      .returning();
    return { chapter: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
