'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type CourseObjective,
  CompleteCourseObjective,
} from '@/lib/db/schema/courseObjectives';
import Modal from '@/components/shared/Modal';
import { type Course, type CourseId } from '@/lib/db/schema/courses';
import { useOptimisticCourseObjectives } from '@/app/(app)/course-objectives/useOptimisticCourseObjectives';
import { Button } from '@/components/ui/button';
import CourseObjectiveForm from './CourseObjectiveForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (courseObjective?: CourseObjective) => void;

export default function CourseObjectiveList({
  courseObjectives,
  courses,
  courseId,
}: {
  courseObjectives: CompleteCourseObjective[];
  courses: Course[];
  courseId?: CourseId;
}) {
  const { optimisticCourseObjectives, addOptimisticCourseObjective } =
    useOptimisticCourseObjectives(courseObjectives, courses);
  const [open, setOpen] = useState(false);
  const [activeCourseObjective, setActiveCourseObjective] =
    useState<CourseObjective | null>(null);
  const openModal = (courseObjective?: CourseObjective) => {
    setOpen(true);
    courseObjective
      ? setActiveCourseObjective(courseObjective)
      : setActiveCourseObjective(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeCourseObjective
            ? 'Edit CourseObjective'
            : 'Create Course Objective'
        }
      >
        <CourseObjectiveForm
          courseObjective={activeCourseObjective}
          addOptimistic={addOptimisticCourseObjective}
          openModal={openModal}
          closeModal={closeModal}
          courses={courses}
          courseId={courseId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticCourseObjectives.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCourseObjectives.map((courseObjective) => (
            <CourseObjective
              courseObjective={courseObjective}
              key={courseObjective.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const CourseObjective = ({
  courseObjective,
  openModal,
}: {
  courseObjective: CompleteCourseObjective;
  openModal: TOpenModal;
}) => {
  const optimistic = courseObjective.id === 'optimistic';
  const deleting = courseObjective.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('course-objectives')
    ? pathname
    : pathname + '/course-objectives/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{courseObjective.objective}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + courseObjective.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No course objectives
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new course objective.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Course Objectives{' '}
        </Button>
      </div>
    </div>
  );
};
