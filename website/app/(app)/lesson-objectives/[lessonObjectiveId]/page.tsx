import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getLessonObjectiveById } from "@/lib/api/lessonObjectives/queries";
import { getLessons } from "@/lib/api/lessons/queries";import OptimisticLessonObjective from "@/app/(app)/lesson-objectives/[lessonObjectiveId]/OptimisticLessonObjective";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function LessonObjectivePage({
  params,
}: {
  params: { lessonObjectiveId: string };
}) {

  return (
    <main className="overflow-auto">
      <LessonObjective id={params.lessonObjectiveId} />
    </main>
  );
}

const LessonObjective = async ({ id }: { id: string }) => {
  
  const { lessonObjective } = await getLessonObjectiveById(id);
  const { lessons } = await getLessons();

  if (!lessonObjective) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="lesson-objectives" />
        <OptimisticLessonObjective lessonObjective={lessonObjective} lessons={lessons} />
      </div>
    </Suspense>
  );
};
