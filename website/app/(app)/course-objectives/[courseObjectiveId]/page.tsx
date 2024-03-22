import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getCourseObjectiveById } from '@/lib/api/courseObjectives/queries';
import { getCourses } from '@/lib/api/courses/queries';
import OptimisticCourseObjective from '@/app/(app)/course-objectives/[courseObjectiveId]/OptimisticCourseObjective';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function CourseObjectivePage({
  params,
}: {
  params: { courseObjectiveId: string };
}) {
  return (
    <main className="overflow-auto">
      <CourseObjective id={params.courseObjectiveId} />
    </main>
  );
}

const CourseObjective = async ({ id }: { id: string }) => {
  const { courseObjective } = await getCourseObjectiveById(id);
  const { courses } = await getCourses();

  if (!courseObjective) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="course-objectives" />
        <OptimisticCourseObjective
          courseObjective={courseObjective}
          courses={courses}
        />
      </div>
    </Suspense>
  );
};
