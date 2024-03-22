import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getLessonReferenceById } from '@/lib/api/lessonReferences/queries';
import { getLessons } from '@/lib/api/lessons/queries';
import OptimisticLessonReference from '@/app/(app)/lesson-references/[lessonReferenceId]/OptimisticLessonReference';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function LessonReferencePage({
  params,
}: {
  params: { lessonReferenceId: string };
}) {
  return (
    <main className="overflow-auto">
      <LessonReference id={params.lessonReferenceId} />
    </main>
  );
}

const LessonReference = async ({ id }: { id: string }) => {
  const { lessonReference } = await getLessonReferenceById(id);
  const { lessons } = await getLessons();

  if (!lessonReference) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="lesson-references" />
        <OptimisticLessonReference
          lessonReference={lessonReference}
          lessons={lessons}
        />
      </div>
    </Suspense>
  );
};
