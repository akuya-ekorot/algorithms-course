"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Lesson, CompleteLesson } from "@/lib/db/schema/lessons";
import Modal from "@/components/shared/Modal";
import { type Course, type CourseId } from "@/lib/db/schema/courses";
import { useOptimisticLessons } from "@/app/(app)/lessons/useOptimisticLessons";
import { Button } from "@/components/ui/button";
import LessonForm from "./LessonForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (lesson?: Lesson) => void;

export default function LessonList({
  lessons,
  courses,
  courseId 
}: {
  lessons: CompleteLesson[];
  courses: Course[];
  courseId?: CourseId 
}) {
  const { optimisticLessons, addOptimisticLesson } = useOptimisticLessons(
    lessons,
    courses 
  );
  const [open, setOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const openModal = (lesson?: Lesson) => {
    setOpen(true);
    lesson ? setActiveLesson(lesson) : setActiveLesson(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeLesson ? "Edit Lesson" : "Create Lesson"}
      >
        <LessonForm
          lesson={activeLesson}
          addOptimistic={addOptimisticLesson}
          openModal={openModal}
          closeModal={closeModal}
          courses={courses}
        courseId={courseId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticLessons.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLessons.map((lesson) => (
            <Lesson
              lesson={lesson}
              key={lesson.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Lesson = ({
  lesson,
  openModal,
}: {
  lesson: CompleteLesson;
  openModal: TOpenModal;
}) => {
  const optimistic = lesson.id === "optimistic";
  const deleting = lesson.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("lessons")
    ? pathname
    : pathname + "/lessons/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{lesson.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + lesson.id }>
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
        No lessons
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new lesson.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Lessons </Button>
      </div>
    </div>
  );
};
