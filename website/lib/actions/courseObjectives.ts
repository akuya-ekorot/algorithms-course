'use server';

import { revalidatePath } from 'next/cache';
import {
  createCourseObjective,
  deleteCourseObjective,
  updateCourseObjective,
} from '@/lib/api/courseObjectives/mutations';
import {
  CourseObjectiveId,
  NewCourseObjectiveParams,
  UpdateCourseObjectiveParams,
  courseObjectiveIdSchema,
  insertCourseObjectiveParams,
  updateCourseObjectiveParams,
} from '@/lib/db/schema/courseObjectives';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCourseObjectives = () => revalidatePath('/course-objectives');

export const createCourseObjectiveAction = async (
  input: NewCourseObjectiveParams,
) => {
  try {
    const payload = insertCourseObjectiveParams.parse(input);
    await createCourseObjective(payload);
    revalidateCourseObjectives();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCourseObjectiveAction = async (
  input: UpdateCourseObjectiveParams,
) => {
  try {
    const payload = updateCourseObjectiveParams.parse(input);
    await updateCourseObjective(payload.id, payload);
    revalidateCourseObjectives();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCourseObjectiveAction = async (input: CourseObjectiveId) => {
  try {
    const payload = courseObjectiveIdSchema.parse({ id: input });
    await deleteCourseObjective(payload.id);
    revalidateCourseObjectives();
  } catch (e) {
    return handleErrors(e);
  }
};
