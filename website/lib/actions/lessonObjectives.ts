'use server';

import { revalidatePath } from 'next/cache';
import {
  createLessonObjective,
  deleteLessonObjective,
  updateLessonObjective,
} from '@/lib/api/lessonObjectives/mutations';
import {
  LessonObjectiveId,
  NewLessonObjectiveParams,
  UpdateLessonObjectiveParams,
  lessonObjectiveIdSchema,
  insertLessonObjectiveParams,
  updateLessonObjectiveParams,
} from '@/lib/db/schema/lessonObjectives';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLessonObjectives = () => revalidatePath('/lesson-objectives');

export const createLessonObjectiveAction = async (
  input: NewLessonObjectiveParams,
) => {
  try {
    const payload = insertLessonObjectiveParams.parse(input);
    await createLessonObjective(payload);
    revalidateLessonObjectives();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLessonObjectiveAction = async (
  input: UpdateLessonObjectiveParams,
) => {
  try {
    const payload = updateLessonObjectiveParams.parse(input);
    await updateLessonObjective(payload.id, payload);
    revalidateLessonObjectives();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLessonObjectiveAction = async (input: LessonObjectiveId) => {
  try {
    const payload = lessonObjectiveIdSchema.parse({ id: input });
    await deleteLessonObjective(payload.id);
    revalidateLessonObjectives();
  } catch (e) {
    return handleErrors(e);
  }
};
