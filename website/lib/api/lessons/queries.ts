import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type LessonId, lessonIdSchema, lessons } from "@/lib/db/schema/lessons";
import { courses } from "@/lib/db/schema/courses";
import { lessonObjectives, type CompleteLessonObjective } from "@/lib/db/schema/lessonObjectives";
import { lessonReferences, type CompleteLessonReference } from "@/lib/db/schema/lessonReferences";
import { chapters, type CompleteChapter } from "@/lib/db/schema/chapters";

export const getLessons = async () => {
  const rows = await db.select({ lesson: lessons, course: courses }).from(lessons).leftJoin(courses, eq(lessons.courseId, courses.id));
  const l = rows .map((r) => ({ ...r.lesson, course: r.course})); 
  return { lessons: l };
};

export const getLessonById = async (id: LessonId) => {
  const { id: lessonId } = lessonIdSchema.parse({ id });
  const [row] = await db.select({ lesson: lessons, course: courses }).from(lessons).where(eq(lessons.id, lessonId)).leftJoin(courses, eq(lessons.courseId, courses.id));
  if (row === undefined) return {};
  const l =  { ...row.lesson, course: row.course } ;
  return { lesson: l };
};

export const getLessonByIdWithLessonObjectivesAndLessonReferencesAndChapters = async (id: LessonId) => {
  const { id: lessonId } = lessonIdSchema.parse({ id });
  const rows = await db.select({ lesson: lessons, lessonObjective: lessonObjectives, lessonReference: lessonReferences, chapter: chapters }).from(lessons).where(eq(lessons.id, lessonId)).leftJoin(lessonObjectives, eq(lessons.id, lessonObjectives.lessonId)).leftJoin(lessonReferences, eq(lessons.id, lessonReferences.lessonId)).leftJoin(chapters, eq(lessons.id, chapters.lessonId));
  if (rows.length === 0) return {};
  const l = rows[0].lesson;
  const ll = rows.filter((r) => r.lessonObjective !== null).map((l) => l.lessonObjective) as CompleteLessonObjective[];
  const ll = rows.filter((r) => r.lessonReference !== null).map((l) => l.lessonReference) as CompleteLessonReference[];
  const lc = rows.filter((r) => r.chapter !== null).map((c) => c.chapter) as CompleteChapter[];

  return { lesson: l, lessonObjectives: ll, lessonReferences: ll, chapters: lc };
};

