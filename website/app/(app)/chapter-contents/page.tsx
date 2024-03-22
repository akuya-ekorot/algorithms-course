import { Suspense } from "react";

import Loading from "@/app/loading";
import ChapterContentList from "@/components/chapterContents/ChapterContentList";
import { getChapterContents } from "@/lib/api/chapterContents/queries";
import { getChapters } from "@/lib/api/chapters/queries";

export const revalidate = 0;

export default async function ChapterContentsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Chapter Contents</h1>
        </div>
        <ChapterContents />
      </div>
    </main>
  );
}

const ChapterContents = async () => {
  
  const { chapterContents } = await getChapterContents();
  const { chapters } = await getChapters();
  return (
    <Suspense fallback={<Loading />}>
      <ChapterContentList chapterContents={chapterContents} chapters={chapters} />
    </Suspense>
  );
};
