"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type LessonReference, CompleteLessonReference } from "@/lib/db/schema/lessonReferences";
import Modal from "@/components/shared/Modal";
import { type Lesson, type LessonId } from "@/lib/db/schema/lessons";
import { useOptimisticLessonReferences } from "@/app/(app)/lesson-references/useOptimisticLessonReferences";
import { Button } from "@/components/ui/button";
import LessonReferenceForm from "./LessonReferenceForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (lessonReference?: LessonReference) => void;

export default function LessonReferenceList({
  lessonReferences,
  lessons,
  lessonId 
}: {
  lessonReferences: CompleteLessonReference[];
  lessons: Lesson[];
  lessonId?: LessonId 
}) {
  const { optimisticLessonReferences, addOptimisticLessonReference } = useOptimisticLessonReferences(
    lessonReferences,
    lessons 
  );
  const [open, setOpen] = useState(false);
  const [activeLessonReference, setActiveLessonReference] = useState<LessonReference | null>(null);
  const openModal = (lessonReference?: LessonReference) => {
    setOpen(true);
    lessonReference ? setActiveLessonReference(lessonReference) : setActiveLessonReference(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeLessonReference ? "Edit LessonReference" : "Create Lesson Reference"}
      >
        <LessonReferenceForm
          lessonReference={activeLessonReference}
          addOptimistic={addOptimisticLessonReference}
          openModal={openModal}
          closeModal={closeModal}
          lessons={lessons}
        lessonId={lessonId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticLessonReferences.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLessonReferences.map((lessonReference) => (
            <LessonReference
              lessonReference={lessonReference}
              key={lessonReference.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const LessonReference = ({
  lessonReference,
  openModal,
}: {
  lessonReference: CompleteLessonReference;
  openModal: TOpenModal;
}) => {
  const optimistic = lessonReference.id === "optimistic";
  const deleting = lessonReference.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("lesson-references")
    ? pathname
    : pathname + "/lesson-references/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{lessonReference.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + lessonReference.id }>
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
        No lesson references
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new lesson reference.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Lesson References </Button>
      </div>
    </div>
  );
};
