"use server";

import { revalidatePath } from "next/cache";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/lib/api/courses/mutations";
import {
  CourseId,
  NewCourseParams,
  UpdateCourseParams,
  courseIdSchema,
  insertCourseParams,
  updateCourseParams,
} from "@/lib/db/schema/courses";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCourses = () => revalidatePath("/courses");

export const createCourseAction = async (input: NewCourseParams) => {
  try {
    const payload = insertCourseParams.parse(input);
    await createCourse(payload);
    revalidateCourses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCourseAction = async (input: UpdateCourseParams) => {
  try {
    const payload = updateCourseParams.parse(input);
    await updateCourse(payload.id, payload);
    revalidateCourses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCourseAction = async (input: CourseId) => {
  try {
    const payload = courseIdSchema.parse({ id: input });
    await deleteCourse(payload.id);
    revalidateCourses();
  } catch (e) {
    return handleErrors(e);
  }
};