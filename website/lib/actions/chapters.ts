"use server";

import { revalidatePath } from "next/cache";
import {
  createChapter,
  deleteChapter,
  updateChapter,
} from "@/lib/api/chapters/mutations";
import {
  ChapterId,
  NewChapterParams,
  UpdateChapterParams,
  chapterIdSchema,
  insertChapterParams,
  updateChapterParams,
} from "@/lib/db/schema/chapters";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateChapters = () => revalidatePath("/chapters");

export const createChapterAction = async (input: NewChapterParams) => {
  try {
    const payload = insertChapterParams.parse(input);
    await createChapter(payload);
    revalidateChapters();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateChapterAction = async (input: UpdateChapterParams) => {
  try {
    const payload = updateChapterParams.parse(input);
    await updateChapter(payload.id, payload);
    revalidateChapters();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteChapterAction = async (input: ChapterId) => {
  try {
    const payload = chapterIdSchema.parse({ id: input });
    await deleteChapter(payload.id);
    revalidateChapters();
  } catch (e) {
    return handleErrors(e);
  }
};