import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  ChapterContentId, 
  NewChapterContentParams,
  UpdateChapterContentParams, 
  updateChapterContentSchema,
  insertChapterContentSchema, 
  chapterContents,
  chapterContentIdSchema 
} from "@/lib/db/schema/chapterContents";

export const createChapterContent = async (chapterContent: NewChapterContentParams) => {
  const newChapterContent = insertChapterContentSchema.parse(chapterContent);
  try {
    const [c] =  await db.insert(chapterContents).values(newChapterContent).returning();
    return { chapterContent: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateChapterContent = async (id: ChapterContentId, chapterContent: UpdateChapterContentParams) => {
  const { id: chapterContentId } = chapterContentIdSchema.parse({ id });
  const newChapterContent = updateChapterContentSchema.parse(chapterContent);
  try {
    const [c] =  await db
     .update(chapterContents)
     .set({...newChapterContent, updatedAt: new Date() })
     .where(eq(chapterContents.id, chapterContentId!))
     .returning();
    return { chapterContent: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteChapterContent = async (id: ChapterContentId) => {
  const { id: chapterContentId } = chapterContentIdSchema.parse({ id });
  try {
    const [c] =  await db.delete(chapterContents).where(eq(chapterContents.id, chapterContentId!))
    .returning();
    return { chapterContent: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

