import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type LessonReferenceId,
  lessonReferenceIdSchema,
  lessonReferences,
} from '@/lib/db/schema/lessonReferences';
import { lessons } from '@/lib/db/schema/lessons';

export const getLessonReferences = async () => {
  const rows = await db
    .select({ lessonReference: lessonReferences, lesson: lessons })
    .from(lessonReferences)
    .leftJoin(lessons, eq(lessonReferences.lessonId, lessons.id));
  const l = rows.map((r) => ({ ...r.lessonReference, lesson: r.lesson }));
  return { lessonReferences: l };
};

export const getLessonReferenceById = async (id: LessonReferenceId) => {
  const { id: lessonReferenceId } = lessonReferenceIdSchema.parse({ id });
  const [row] = await db
    .select({ lessonReference: lessonReferences, lesson: lessons })
    .from(lessonReferences)
    .where(eq(lessonReferences.id, lessonReferenceId))
    .leftJoin(lessons, eq(lessonReferences.lessonId, lessons.id));
  if (row === undefined) return {};
  const l = { ...row.lessonReference, lesson: row.lesson };
  return { lessonReference: l };
};
