"use server";

import { revalidatePath } from "next/cache";
import {
  createLesson,
  deleteLesson,
  updateLesson,
} from "@/lib/api/lessons/mutations";
import {
  LessonId,
  NewLessonParams,
  UpdateLessonParams,
  lessonIdSchema,
  insertLessonParams,
  updateLessonParams,
} from "@/lib/db/schema/lessons";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLessons = () => revalidatePath("/lessons");

export const createLessonAction = async (input: NewLessonParams) => {
  try {
    const payload = insertLessonParams.parse(input);
    await createLesson(payload);
    revalidateLessons();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLessonAction = async (input: UpdateLessonParams) => {
  try {
    const payload = updateLessonParams.parse(input);
    await updateLesson(payload.id, payload);
    revalidateLessons();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLessonAction = async (input: LessonId) => {
  try {
    const payload = lessonIdSchema.parse({ id: input });
    await deleteLesson(payload.id);
    revalidateLessons();
  } catch (e) {
    return handleErrors(e);
  }
};