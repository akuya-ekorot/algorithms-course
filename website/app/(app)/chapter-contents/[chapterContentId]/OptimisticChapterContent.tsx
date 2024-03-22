'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/chapter-contents/useOptimisticChapterContents';
import { type ChapterContent } from '@/lib/db/schema/chapterContents';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import ChapterContentForm from '@/components/chapterContents/ChapterContentForm';
import { type Chapter, type ChapterId } from '@/lib/db/schema/chapters';

export default function OptimisticChapterContent({
  chapterContent,
  chapters,
  chapterId,
}: {
  chapterContent: ChapterContent;

  chapters: Chapter[];
  chapterId?: ChapterId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ChapterContent) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticChapterContent, setOptimisticChapterContent] =
    useOptimistic(chapterContent);
  const updateChapterContent: TAddOptimistic = (input) =>
    setOptimisticChapterContent({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ChapterContentForm
          chapterContent={optimisticChapterContent}
          chapters={chapters}
          chapterId={chapterId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateChapterContent}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {optimisticChapterContent.type}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticChapterContent.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticChapterContent, null, 2)}
      </pre>
    </div>
  );
}
