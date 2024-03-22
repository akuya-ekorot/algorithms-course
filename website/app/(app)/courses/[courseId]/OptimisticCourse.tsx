"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/courses/useOptimisticCourses";
import { type Course } from "@/lib/db/schema/courses";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CourseForm from "@/components/courses/CourseForm";


export default function OptimisticCourse({ 
  course,
   
}: { 
  course: Course; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Course) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCourse, setOptimisticCourse] = useOptimistic(course);
  const updateCourse: TAddOptimistic = (input) =>
    setOptimisticCourse({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CourseForm
          course={optimisticCourse}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCourse}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticCourse.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCourse.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCourse, null, 2)}
      </pre>
    </div>
  );
}
