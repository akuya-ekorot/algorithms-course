import { Suspense } from 'react';

import Loading from '@/app/loading';
import LessonObjectiveList from '@/components/lessonObjectives/LessonObjectiveList';
import { getLessonObjectives } from '@/lib/api/lessonObjectives/queries';
import { getLessons } from '@/lib/api/lessons/queries';

export const revalidate = 0;

export default async function LessonObjectivesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Lesson Objectives</h1>
        </div>
        <LessonObjectives />
      </div>
    </main>
  );
}

const LessonObjectives = async () => {
  const { lessonObjectives } = await getLessonObjectives();
  const { lessons } = await getLessons();
  return (
    <Suspense fallback={<Loading />}>
      <LessonObjectiveList
        lessonObjectives={lessonObjectives}
        lessons={lessons}
      />
    </Suspense>
  );
};
