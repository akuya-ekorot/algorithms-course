import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  LessonReferenceId,
  NewLessonReferenceParams,
  UpdateLessonReferenceParams,
  updateLessonReferenceSchema,
  insertLessonReferenceSchema,
  lessonReferences,
  lessonReferenceIdSchema,
} from '@/lib/db/schema/lessonReferences';

export const createLessonReference = async (
  lessonReference: NewLessonReferenceParams,
) => {
  const newLessonReference = insertLessonReferenceSchema.parse(lessonReference);
  try {
    const [l] = await db
      .insert(lessonReferences)
      .values(newLessonReference)
      .returning();
    return { lessonReference: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateLessonReference = async (
  id: LessonReferenceId,
  lessonReference: UpdateLessonReferenceParams,
) => {
  const { id: lessonReferenceId } = lessonReferenceIdSchema.parse({ id });
  const newLessonReference = updateLessonReferenceSchema.parse(lessonReference);
  try {
    const [l] = await db
      .update(lessonReferences)
      .set({ ...newLessonReference, updatedAt: new Date() })
      .where(eq(lessonReferences.id, lessonReferenceId!))
      .returning();
    return { lessonReference: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteLessonReference = async (id: LessonReferenceId) => {
  const { id: lessonReferenceId } = lessonReferenceIdSchema.parse({ id });
  try {
    const [l] = await db
      .delete(lessonReferences)
      .where(eq(lessonReferences.id, lessonReferenceId!))
      .returning();
    return { lessonReference: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
