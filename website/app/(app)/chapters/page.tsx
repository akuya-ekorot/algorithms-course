import { Suspense } from "react";

import Loading from "@/app/loading";
import ChapterList from "@/components/chapters/ChapterList";
import { getChapters } from "@/lib/api/chapters/queries";
import { getLessons } from "@/lib/api/lessons/queries";

export const revalidate = 0;

export default async function ChaptersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Chapters</h1>
        </div>
        <Chapters />
      </div>
    </main>
  );
}

const Chapters = async () => {
  
  const { chapters } = await getChapters();
  const { lessons } = await getLessons();
  return (
    <Suspense fallback={<Loading />}>
      <ChapterList chapters={chapters} lessons={lessons} />
    </Suspense>
  );
};
