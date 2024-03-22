import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  LessonId, 
  NewLessonParams,
  UpdateLessonParams, 
  updateLessonSchema,
  insertLessonSchema, 
  lessons,
  lessonIdSchema 
} from "@/lib/db/schema/lessons";

export const createLesson = async (lesson: NewLessonParams) => {
  const newLesson = insertLessonSchema.parse(lesson);
  try {
    const [l] =  await db.insert(lessons).values(newLesson).returning();
    return { lesson: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLesson = async (id: LessonId, lesson: UpdateLessonParams) => {
  const { id: lessonId } = lessonIdSchema.parse({ id });
  const newLesson = updateLessonSchema.parse(lesson);
  try {
    const [l] =  await db
     .update(lessons)
     .set({...newLesson, updatedAt: new Date() })
     .where(eq(lessons.id, lessonId!))
     .returning();
    return { lesson: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLesson = async (id: LessonId) => {
  const { id: lessonId } = lessonIdSchema.parse({ id });
  try {
    const [l] =  await db.delete(lessons).where(eq(lessons.id, lessonId!))
    .returning();
    return { lesson: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

