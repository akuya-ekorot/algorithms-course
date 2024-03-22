"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Chapter, CompleteChapter } from "@/lib/db/schema/chapters";
import Modal from "@/components/shared/Modal";
import { type Lesson, type LessonId } from "@/lib/db/schema/lessons";
import { useOptimisticChapters } from "@/app/(app)/chapters/useOptimisticChapters";
import { Button } from "@/components/ui/button";
import ChapterForm from "./ChapterForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (chapter?: Chapter) => void;

export default function ChapterList({
  chapters,
  lessons,
  lessonId 
}: {
  chapters: CompleteChapter[];
  lessons: Lesson[];
  lessonId?: LessonId 
}) {
  const { optimisticChapters, addOptimisticChapter } = useOptimisticChapters(
    chapters,
    lessons 
  );
  const [open, setOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const openModal = (chapter?: Chapter) => {
    setOpen(true);
    chapter ? setActiveChapter(chapter) : setActiveChapter(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeChapter ? "Edit Chapter" : "Create Chapter"}
      >
        <ChapterForm
          chapter={activeChapter}
          addOptimistic={addOptimisticChapter}
          openModal={openModal}
          closeModal={closeModal}
          lessons={lessons}
        lessonId={lessonId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticChapters.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticChapters.map((chapter) => (
            <Chapter
              chapter={chapter}
              key={chapter.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Chapter = ({
  chapter,
  openModal,
}: {
  chapter: CompleteChapter;
  openModal: TOpenModal;
}) => {
  const optimistic = chapter.id === "optimistic";
  const deleting = chapter.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("chapters")
    ? pathname
    : pathname + "/chapters/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{chapter.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + chapter.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No chapters
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new chapter.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Chapters </Button>
      </div>
    </div>
  );
};
