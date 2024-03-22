'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type ChapterContent,
  CompleteChapterContent,
} from '@/lib/db/schema/chapterContents';
import Modal from '@/components/shared/Modal';
import { type Chapter, type ChapterId } from '@/lib/db/schema/chapters';
import { useOptimisticChapterContents } from '@/app/(app)/chapter-contents/useOptimisticChapterContents';
import { Button } from '@/components/ui/button';
import ChapterContentForm from './ChapterContentForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (chapterContent?: ChapterContent) => void;

export default function ChapterContentList({
  chapterContents,
  chapters,
  chapterId,
}: {
  chapterContents: CompleteChapterContent[];
  chapters: Chapter[];
  chapterId?: ChapterId;
}) {
  const { optimisticChapterContents, addOptimisticChapterContent } =
    useOptimisticChapterContents(chapterContents, chapters);
  const [open, setOpen] = useState(false);
  const [activeChapterContent, setActiveChapterContent] =
    useState<ChapterContent | null>(null);
  const openModal = (chapterContent?: ChapterContent) => {
    setOpen(true);
    chapterContent
      ? setActiveChapterContent(chapterContent)
      : setActiveChapterContent(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeChapterContent
            ? 'Edit ChapterContent'
            : 'Create Chapter Content'
        }
      >
        <ChapterContentForm
          chapterContent={activeChapterContent}
          addOptimistic={addOptimisticChapterContent}
          openModal={openModal}
          closeModal={closeModal}
          chapters={chapters}
          chapterId={chapterId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticChapterContents.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticChapterContents.map((chapterContent) => (
            <ChapterContent
              chapterContent={chapterContent}
              key={chapterContent.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ChapterContent = ({
  chapterContent,
  openModal,
}: {
  chapterContent: CompleteChapterContent;
  openModal: TOpenModal;
}) => {
  const optimistic = chapterContent.id === 'optimistic';
  const deleting = chapterContent.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('chapter-contents')
    ? pathname
    : pathname + '/chapter-contents/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{chapterContent.type}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + chapterContent.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No chapter contents
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new chapter content.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Chapter Contents{' '}
        </Button>
      </div>
    </div>
  );
};
