'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type LessonObjective,
  CompleteLessonObjective,
} from '@/lib/db/schema/lessonObjectives';
import Modal from '@/components/shared/Modal';
import { type Lesson, type LessonId } from '@/lib/db/schema/lessons';
import { useOptimisticLessonObjectives } from '@/app/(app)/lesson-objectives/useOptimisticLessonObjectives';
import { Button } from '@/components/ui/button';
import LessonObjectiveForm from './LessonObjectiveForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (lessonObjective?: LessonObjective) => void;

export default function LessonObjectiveList({
  lessonObjectives,
  lessons,
  lessonId,
}: {
  lessonObjectives: CompleteLessonObjective[];
  lessons: Lesson[];
  lessonId?: LessonId;
}) {
  const { optimisticLessonObjectives, addOptimisticLessonObjective } =
    useOptimisticLessonObjectives(lessonObjectives, lessons);
  const [open, setOpen] = useState(false);
  const [activeLessonObjective, setActiveLessonObjective] =
    useState<LessonObjective | null>(null);
  const openModal = (lessonObjective?: LessonObjective) => {
    setOpen(true);
    lessonObjective
      ? setActiveLessonObjective(lessonObjective)
      : setActiveLessonObjective(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeLessonObjective
            ? 'Edit LessonObjective'
            : 'Create Lesson Objective'
        }
      >
        <LessonObjectiveForm
          lessonObjective={activeLessonObjective}
          addOptimistic={addOptimisticLessonObjective}
          openModal={openModal}
          closeModal={closeModal}
          lessons={lessons}
          lessonId={lessonId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticLessonObjectives.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLessonObjectives.map((lessonObjective) => (
            <LessonObjective
              lessonObjective={lessonObjective}
              key={lessonObjective.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const LessonObjective = ({
  lessonObjective,
  openModal,
}: {
  lessonObjective: CompleteLessonObjective;
  openModal: TOpenModal;
}) => {
  const optimistic = lessonObjective.id === 'optimistic';
  const deleting = lessonObjective.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('lesson-objectives')
    ? pathname
    : pathname + '/lesson-objectives/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{lessonObjective.objective}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + lessonObjective.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No lesson objectives
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new lesson objective.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Lesson Objectives{' '}
        </Button>
      </div>
    </div>
  );
};
