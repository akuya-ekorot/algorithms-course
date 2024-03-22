"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/chapters/useOptimisticChapters";
import { type Chapter } from "@/lib/db/schema/chapters";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ChapterForm from "@/components/chapters/ChapterForm";
import { type Lesson, type LessonId } from "@/lib/db/schema/lessons";

export default function OptimisticChapter({ 
  chapter,
  lessons,
  lessonId 
}: { 
  chapter: Chapter; 
  
  lessons: Lesson[];
  lessonId?: LessonId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Chapter) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticChapter, setOptimisticChapter] = useOptimistic(chapter);
  const updateChapter: TAddOptimistic = (input) =>
    setOptimisticChapter({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ChapterForm
          chapter={optimisticChapter}
          lessons={lessons}
        lessonId={lessonId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateChapter}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticChapter.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticChapter.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticChapter, null, 2)}
      </pre>
    </div>
  );
}
