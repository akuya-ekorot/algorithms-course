import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type CourseObjectiveId, courseObjectiveIdSchema, courseObjectives } from "@/lib/db/schema/courseObjectives";
import { courses } from "@/lib/db/schema/courses";

export const getCourseObjectives = async () => {
  const rows = await db.select({ courseObjective: courseObjectives, course: courses }).from(courseObjectives).leftJoin(courses, eq(courseObjectives.courseId, courses.id));
  const c = rows .map((r) => ({ ...r.courseObjective, course: r.course})); 
  return { courseObjectives: c };
};

export const getCourseObjectiveById = async (id: CourseObjectiveId) => {
  const { id: courseObjectiveId } = courseObjectiveIdSchema.parse({ id });
  const [row] = await db.select({ courseObjective: courseObjectives, course: courses }).from(courseObjectives).where(eq(courseObjectives.id, courseObjectiveId)).leftJoin(courses, eq(courseObjectives.courseId, courses.id));
  if (row === undefined) return {};
  const c =  { ...row.courseObjective, course: row.course } ;
  return { courseObjective: c };
};


