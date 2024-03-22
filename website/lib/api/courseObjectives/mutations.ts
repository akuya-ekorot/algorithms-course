import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  CourseObjectiveId,
  NewCourseObjectiveParams,
  UpdateCourseObjectiveParams,
  updateCourseObjectiveSchema,
  insertCourseObjectiveSchema,
  courseObjectives,
  courseObjectiveIdSchema,
} from '@/lib/db/schema/courseObjectives';

export const createCourseObjective = async (
  courseObjective: NewCourseObjectiveParams,
) => {
  const newCourseObjective = insertCourseObjectiveSchema.parse(courseObjective);
  try {
    const [c] = await db
      .insert(courseObjectives)
      .values(newCourseObjective)
      .returning();
    return { courseObjective: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateCourseObjective = async (
  id: CourseObjectiveId,
  courseObjective: UpdateCourseObjectiveParams,
) => {
  const { id: courseObjectiveId } = courseObjectiveIdSchema.parse({ id });
  const newCourseObjective = updateCourseObjectiveSchema.parse(courseObjective);
  try {
    const [c] = await db
      .update(courseObjectives)
      .set({ ...newCourseObjective, updatedAt: new Date() })
      .where(eq(courseObjectives.id, courseObjectiveId!))
      .returning();
    return { courseObjective: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteCourseObjective = async (id: CourseObjectiveId) => {
  const { id: courseObjectiveId } = courseObjectiveIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(courseObjectives)
      .where(eq(courseObjectives.id, courseObjectiveId!))
      .returning();
    return { courseObjective: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
