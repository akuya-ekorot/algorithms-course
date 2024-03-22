"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/course-objectives/useOptimisticCourseObjectives";
import { type CourseObjective } from "@/lib/db/schema/courseObjectives";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CourseObjectiveForm from "@/components/courseObjectives/CourseObjectiveForm";
import { type Course, type CourseId } from "@/lib/db/schema/courses";

export default function OptimisticCourseObjective({ 
  courseObjective,
  courses,
  courseId 
}: { 
  courseObjective: CourseObjective; 
  
  courses: Course[];
  courseId?: CourseId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CourseObjective) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCourseObjective, setOptimisticCourseObjective] = useOptimistic(courseObjective);
  const updateCourseObjective: TAddOptimistic = (input) =>
    setOptimisticCourseObjective({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CourseObjectiveForm
          courseObjective={optimisticCourseObjective}
          courses={courses}
        courseId={courseId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCourseObjective}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticCourseObjective.objective}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCourseObjective.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCourseObjective, null, 2)}
      </pre>
    </div>
  );
}
