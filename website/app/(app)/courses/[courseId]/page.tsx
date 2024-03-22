import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getCourseByIdWithCourseObjectivesAndLessons } from '@/lib/api/courses/queries';
import OptimisticCourse from './OptimisticCourse';
import CourseObjectiveList from '@/components/courseObjectives/CourseObjectiveList';
import LessonList from '@/components/lessons/LessonList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <main className="overflow-auto">
      <Course id={params.courseId} />
    </main>
  );
}

const Course = async ({ id }: { id: string }) => {
  const { course, courseObjectives, lessons } =
    await getCourseByIdWithCourseObjectivesAndLessons(id);

  if (!course) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="courses" />
        <OptimisticCourse course={course} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {course.title}&apos;s Course Objectives
        </h3>
        <CourseObjectiveList
          courses={[]}
          courseId={course.id}
          courseObjectives={courseObjectives}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {course.title}&apos;s Lessons
        </h3>
        <LessonList courses={[]} courseId={course.id} lessons={lessons} />
      </div>
    </Suspense>
  );
};
