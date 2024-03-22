'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/lesson-objectives/useOptimisticLessonObjectives';
import { type LessonObjective } from '@/lib/db/schema/lessonObjectives';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import LessonObjectiveForm from '@/components/lessonObjectives/LessonObjectiveForm';
import { type Lesson, type LessonId } from '@/lib/db/schema/lessons';

export default function OptimisticLessonObjective({
  lessonObjective,
  lessons,
  lessonId,
}: {
  lessonObjective: LessonObjective;

  lessons: Lesson[];
  lessonId?: LessonId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: LessonObjective) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLessonObjective, setOptimisticLessonObjective] =
    useOptimistic(lessonObjective);
  const updateLessonObjective: TAddOptimistic = (input) =>
    setOptimisticLessonObjective({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LessonObjectiveForm
          lessonObjective={optimisticLessonObjective}
          lessons={lessons}
          lessonId={lessonId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLessonObjective}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {optimisticLessonObjective.objective}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticLessonObjective.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticLessonObjective, null, 2)}
      </pre>
    </div>
  );
}
