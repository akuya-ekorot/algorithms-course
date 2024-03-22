'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type Course, CompleteCourse } from '@/lib/db/schema/courses';
import Modal from '@/components/shared/Modal';

import { useOptimisticCourses } from '@/app/(app)/courses/useOptimisticCourses';
import { Button } from '@/components/ui/button';
import CourseForm from './CourseForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (course?: Course) => void;

export default function CourseList({ courses }: { courses: CompleteCourse[] }) {
  const { optimisticCourses, addOptimisticCourse } =
    useOptimisticCourses(courses);
  const [open, setOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const openModal = (course?: Course) => {
    setOpen(true);
    course ? setActiveCourse(course) : setActiveCourse(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCourse ? 'Edit Course' : 'Create Course'}
      >
        <CourseForm
          course={activeCourse}
          addOptimistic={addOptimisticCourse}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticCourses.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCourses.map((course) => (
            <Course course={course} key={course.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Course = ({
  course,
  openModal,
}: {
  course: CompleteCourse;
  openModal: TOpenModal;
}) => {
  const optimistic = course.id === 'optimistic';
  const deleting = course.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('courses')
    ? pathname
    : pathname + '/courses/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{course.title}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + course.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No courses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new course.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Courses{' '}
        </Button>
      </div>
    </div>
  );
};
