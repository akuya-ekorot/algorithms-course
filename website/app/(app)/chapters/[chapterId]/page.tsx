import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getChapterByIdWithChapterContents } from "@/lib/api/chapters/queries";
import { getLessons } from "@/lib/api/lessons/queries";import OptimisticChapter from "@/app/(app)/chapters/[chapterId]/OptimisticChapter";
import ChapterContentList from "@/components/chapterContents/ChapterContentList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ChapterPage({
  params,
}: {
  params: { chapterId: string };
}) {

  return (
    <main className="overflow-auto">
      <Chapter id={params.chapterId} />
    </main>
  );
}

const Chapter = async ({ id }: { id: string }) => {
  
  const { chapter, chapterContents } = await getChapterByIdWithChapterContents(id);
  const { lessons } = await getLessons();

  if (!chapter) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="chapters" />
        <OptimisticChapter chapter={chapter} lessons={lessons} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{chapter.title}&apos;s Chapter Contents</h3>
        <ChapterContentList
          chapters={[]}
          chapterId={chapter.id}
          chapterContents={chapterContents}
        />
      </div>
    </Suspense>
  );
};
