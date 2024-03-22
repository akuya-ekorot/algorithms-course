import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type LessonObjectiveId,
  lessonObjectiveIdSchema,
  lessonObjectives,
} from '@/lib/db/schema/lessonObjectives';
import { lessons } from '@/lib/db/schema/lessons';

export const getLessonObjectives = async () => {
  const rows = await db
    .select({ lessonObjective: lessonObjectives, lesson: lessons })
    .from(lessonObjectives)
    .leftJoin(lessons, eq(lessonObjectives.lessonId, lessons.id));
  const l = rows.map((r) => ({ ...r.lessonObjective, lesson: r.lesson }));
  return { lessonObjectives: l };
};

export const getLessonObjectiveById = async (id: LessonObjectiveId) => {
  const { id: lessonObjectiveId } = lessonObjectiveIdSchema.parse({ id });
  const [row] = await db
    .select({ lessonObjective: lessonObjectives, lesson: lessons })
    .from(lessonObjectives)
    .where(eq(lessonObjectives.id, lessonObjectiveId))
    .leftJoin(lessons, eq(lessonObjectives.lessonId, lessons.id));
  if (row === undefined) return {};
  const l = { ...row.lessonObjective, lesson: row.lesson };
  return { lessonObjective: l };
};
