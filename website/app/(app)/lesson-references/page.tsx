import { Suspense } from 'react';

import Loading from '@/app/loading';
import LessonReferenceList from '@/components/lessonReferences/LessonReferenceList';
import { getLessonReferences } from '@/lib/api/lessonReferences/queries';
import { getLessons } from '@/lib/api/lessons/queries';

export const revalidate = 0;

export default async function LessonReferencesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Lesson References</h1>
        </div>
        <LessonReferences />
      </div>
    </main>
  );
}

const LessonReferences = async () => {
  const { lessonReferences } = await getLessonReferences();
  const { lessons } = await getLessons();
  return (
    <Suspense fallback={<Loading />}>
      <LessonReferenceList
        lessonReferences={lessonReferences}
        lessons={lessons}
      />
    </Suspense>
  );
};
