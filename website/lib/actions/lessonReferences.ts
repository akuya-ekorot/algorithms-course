'use server';

import { revalidatePath } from 'next/cache';
import {
  createLessonReference,
  deleteLessonReference,
  updateLessonReference,
} from '@/lib/api/lessonReferences/mutations';
import {
  LessonReferenceId,
  NewLessonReferenceParams,
  UpdateLessonReferenceParams,
  lessonReferenceIdSchema,
  insertLessonReferenceParams,
  updateLessonReferenceParams,
} from '@/lib/db/schema/lessonReferences';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLessonReferences = () => revalidatePath('/lesson-references');

export const createLessonReferenceAction = async (
  input: NewLessonReferenceParams,
) => {
  try {
    const payload = insertLessonReferenceParams.parse(input);
    await createLessonReference(payload);
    revalidateLessonReferences();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLessonReferenceAction = async (
  input: UpdateLessonReferenceParams,
) => {
  try {
    const payload = updateLessonReferenceParams.parse(input);
    await updateLessonReference(payload.id, payload);
    revalidateLessonReferences();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLessonReferenceAction = async (input: LessonReferenceId) => {
  try {
    const payload = lessonReferenceIdSchema.parse({ id: input });
    await deleteLessonReference(payload.id);
    revalidateLessonReferences();
  } catch (e) {
    return handleErrors(e);
  }
};
