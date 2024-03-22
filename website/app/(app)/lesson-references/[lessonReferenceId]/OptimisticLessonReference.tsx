'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/lesson-references/useOptimisticLessonReferences';
import { type LessonReference } from '@/lib/db/schema/lessonReferences';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import LessonReferenceForm from '@/components/lessonReferences/LessonReferenceForm';
import { type Lesson, type LessonId } from '@/lib/db/schema/lessons';

export default function OptimisticLessonReference({
  lessonReference,
  lessons,
  lessonId,
}: {
  lessonReference: LessonReference;

  lessons: Lesson[];
  lessonId?: LessonId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: LessonReference) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLessonReference, setOptimisticLessonReference] =
    useOptimistic(lessonReference);
  const updateLessonReference: TAddOptimistic = (input) =>
    setOptimisticLessonReference({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LessonReferenceForm
          lessonReference={optimisticLessonReference}
          lessons={lessons}
          lessonId={lessonId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLessonReference}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {optimisticLessonReference.title}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticLessonReference.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticLessonReference, null, 2)}
      </pre>
    </div>
  );
}
