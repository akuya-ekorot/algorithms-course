'use server';

import { revalidatePath } from 'next/cache';
import {
  createChapterContent,
  deleteChapterContent,
  updateChapterContent,
} from '@/lib/api/chapterContents/mutations';
import {
  ChapterContentId,
  NewChapterContentParams,
  UpdateChapterContentParams,
  chapterContentIdSchema,
  insertChapterContentParams,
  updateChapterContentParams,
} from '@/lib/db/schema/chapterContents';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateChapterContents = () => revalidatePath('/chapter-contents');

export const createChapterContentAction = async (
  input: NewChapterContentParams,
) => {
  try {
    const payload = insertChapterContentParams.parse(input);
    await createChapterContent(payload);
    revalidateChapterContents();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateChapterContentAction = async (
  input: UpdateChapterContentParams,
) => {
  try {
    const payload = updateChapterContentParams.parse(input);
    await updateChapterContent(payload.id, payload);
    revalidateChapterContents();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteChapterContentAction = async (input: ChapterContentId) => {
  try {
    const payload = chapterContentIdSchema.parse({ id: input });
    await deleteChapterContent(payload.id);
    revalidateChapterContents();
  } catch (e) {
    return handleErrors(e);
  }
};
