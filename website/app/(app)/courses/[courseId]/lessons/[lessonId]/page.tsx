import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getLessonByIdWithLessonObjectivesAndLessonReferencesAndChapters } from "@/lib/api/lessons/queries";
import { getCourses } from "@/lib/api/courses/queries";import OptimisticLesson from "@/app/(app)/lessons/[lessonId]/OptimisticLesson";
import LessonObjectiveList from "@/components/lessonObjectives/LessonObjectiveList";
import LessonReferenceList from "@/components/lessonReferences/LessonReferenceList";
import ChapterList from "@/components/chapters/ChapterList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {

  return (
    <main className="overflow-auto">
      <Lesson id={params.lessonId} />
    </main>
  );
}

const Lesson = async ({ id }: { id: string }) => {
  
  const { lesson, lessonObjectives, lessonReferences, chapters } = await getLessonByIdWithLessonObjectivesAndLessonReferencesAndChapters(id);
  const { courses } = await getCourses();

  if (!lesson) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="lessons" />
        <OptimisticLesson lesson={lesson} courses={courses}
        courseId={lesson.courseId} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{lesson.title}&apos;s Lesson Objectives</h3>
        <LessonObjectiveList
          lessons={[]}
          lessonId={lesson.id}
          lessonObjectives={lessonObjectives}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{lesson.title}&apos;s Lesson References</h3>
        <LessonReferenceList
          lessons={[]}
          lessonId={lesson.id}
          lessonReferences={lessonReferences}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{lesson.title}&apos;s Chapters</h3>
        <ChapterList
          lessons={[]}
          lessonId={lesson.id}
          chapters={chapters}
        />
      </div>
    </Suspense>
  );
};
