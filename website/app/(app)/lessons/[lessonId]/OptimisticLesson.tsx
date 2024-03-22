"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/lessons/useOptimisticLessons";
import { type Lesson } from "@/lib/db/schema/lessons";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import LessonForm from "@/components/lessons/LessonForm";
import { type Course, type CourseId } from "@/lib/db/schema/courses";

export default function OptimisticLesson({ 
  lesson,
  courses,
  courseId 
}: { 
  lesson: Lesson; 
  
  courses: Course[];
  courseId?: CourseId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Lesson) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLesson, setOptimisticLesson] = useOptimistic(lesson);
  const updateLesson: TAddOptimistic = (input) =>
    setOptimisticLesson({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LessonForm
          lesson={optimisticLesson}
          courses={courses}
        courseId={courseId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLesson}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticLesson.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticLesson.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticLesson, null, 2)}
      </pre>
    </div>
  );
}
