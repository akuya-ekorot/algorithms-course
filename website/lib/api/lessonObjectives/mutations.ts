import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  LessonObjectiveId,
  NewLessonObjectiveParams,
  UpdateLessonObjectiveParams,
  updateLessonObjectiveSchema,
  insertLessonObjectiveSchema,
  lessonObjectives,
  lessonObjectiveIdSchema,
} from '@/lib/db/schema/lessonObjectives';

export const createLessonObjective = async (
  lessonObjective: NewLessonObjectiveParams,
) => {
  const newLessonObjective = insertLessonObjectiveSchema.parse(lessonObjective);
  try {
    const [l] = await db
      .insert(lessonObjectives)
      .values(newLessonObjective)
      .returning();
    return { lessonObjective: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateLessonObjective = async (
  id: LessonObjectiveId,
  lessonObjective: UpdateLessonObjectiveParams,
) => {
  const { id: lessonObjectiveId } = lessonObjectiveIdSchema.parse({ id });
  const newLessonObjective = updateLessonObjectiveSchema.parse(lessonObjective);
  try {
    const [l] = await db
      .update(lessonObjectives)
      .set({ ...newLessonObjective, updatedAt: new Date() })
      .where(eq(lessonObjectives.id, lessonObjectiveId!))
      .returning();
    return { lessonObjective: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteLessonObjective = async (id: LessonObjectiveId) => {
  const { id: lessonObjectiveId } = lessonObjectiveIdSchema.parse({ id });
  try {
    const [l] = await db
      .delete(lessonObjectives)
      .where(eq(lessonObjectives.id, lessonObjectiveId!))
      .returning();
    return { lessonObjective: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
