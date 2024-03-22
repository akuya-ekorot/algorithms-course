import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type CourseId,
  courseIdSchema,
  courses,
} from '@/lib/db/schema/courses';
import {
  courseObjectives,
  type CompleteCourseObjective,
} from '@/lib/db/schema/courseObjectives';
import { lessons, type CompleteLesson } from '@/lib/db/schema/lessons';

export const getCourses = async () => {
  const rows = await db.select().from(courses);
  const c = rows;
  return { courses: c };
};

export const getCourseById = async (id: CourseId) => {
  const { id: courseId } = courseIdSchema.parse({ id });
  const [row] = await db.select().from(courses).where(eq(courses.id, courseId));
  if (row === undefined) return {};
  const c = row;
  return { course: c };
};

export const getCourseByIdWithCourseObjectivesAndLessons = async (
  id: CourseId,
) => {
  const { id: courseId } = courseIdSchema.parse({ id });
  const rows = await db
    .select({
      course: courses,
      courseObjective: courseObjectives,
      lesson: lessons,
    })
    .from(courses)
    .where(eq(courses.id, courseId))
    .leftJoin(courseObjectives, eq(courses.id, courseObjectives.courseId))
    .leftJoin(lessons, eq(courses.id, lessons.courseId));
  if (rows.length === 0) return {};
  const c = rows[0].course;

  const cc = rows
    .filter((r) => r.courseObjective !== null)
    .filter(
      (r, i, a) =>
        a.findIndex((t) => t.courseObjective!.id === r.courseObjective!.id) ===
        i,
    )
    .map((c) => c.courseObjective) as CompleteCourseObjective[];

  const cl = rows
    .filter((r) => r.lesson !== null)
    .filter(
      (r, i, a) => a.findIndex((t) => t.lesson!.id === r.lesson!.id) === i,
    )
    .map((l) => l.lesson) as CompleteLesson[];

  return { course: c, courseObjectives: cc, lessons: cl };
};
