import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getChapterContentById } from '@/lib/api/chapterContents/queries';
import { getChapters } from '@/lib/api/chapters/queries';
import OptimisticChapterContent from '@/app/(app)/chapter-contents/[chapterContentId]/OptimisticChapterContent';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function ChapterContentPage({
  params,
}: {
  params: { chapterContentId: string };
}) {
  return (
    <main className="overflow-auto">
      <ChapterContent id={params.chapterContentId} />
    </main>
  );
}

const ChapterContent = async ({ id }: { id: string }) => {
  const { chapterContent } = await getChapterContentById(id);
  const { chapters } = await getChapters();

  if (!chapterContent) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="chapter-contents" />
        <OptimisticChapterContent
          chapterContent={chapterContent}
          chapters={chapters}
        />
      </div>
    </Suspense>
  );
};
