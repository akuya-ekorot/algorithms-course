import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/lesson-objectives/useOptimisticLessonObjectives";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type LessonObjective, insertLessonObjectiveParams } from "@/lib/db/schema/lessonObjectives";
import {
  createLessonObjectiveAction,
  deleteLessonObjectiveAction,
  updateLessonObjectiveAction,
} from "@/lib/actions/lessonObjectives";
import { type Lesson, type LessonId } from "@/lib/db/schema/lessons";

const LessonObjectiveForm = ({
  lessons,
  lessonId,
  lessonObjective,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  lessonObjective?: LessonObjective | null;
  lessons: Lesson[];
  lessonId?: LessonId
  openModal?: (lessonObjective?: LessonObjective) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<LessonObjective>(insertLessonObjectiveParams);
  const editing = !!lessonObjective?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("lesson-objectives");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: LessonObjective },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`LessonObjective ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const lessonObjectiveParsed = await insertLessonObjectiveParams.safeParseAsync({ lessonId, ...payload });
    if (!lessonObjectiveParsed.success) {
      setErrors(lessonObjectiveParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = lessonObjectiveParsed.data;
    const pendingLessonObjective: LessonObjective = {
      updatedAt: lessonObjective?.updatedAt ?? new Date(),
      createdAt: lessonObjective?.createdAt ?? new Date(),
      id: lessonObjective?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingLessonObjective,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateLessonObjectiveAction({ ...values, id: lessonObjective.id })
          : await createLessonObjectiveAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingLessonObjective 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.objective ? "text-destructive" : "",
          )}
        >
          Objective
        </Label>
        <Input
          type="text"
          name="objective"
          className={cn(errors?.objective ? "ring ring-destructive" : "")}
          defaultValue={lessonObjective?.objective ?? ""}
        />
        {errors?.objective ? (
          <p className="text-xs text-destructive mt-2">{errors.objective[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.rank ? "text-destructive" : "",
          )}
        >
          Rank
        </Label>
        <Input
          type="text"
          name="rank"
          className={cn(errors?.rank ? "ring ring-destructive" : "")}
          defaultValue={lessonObjective?.rank ?? ""}
        />
        {errors?.rank ? (
          <p className="text-xs text-destructive mt-2">{errors.rank[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {lessonId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.lessonId ? "text-destructive" : "",
          )}
        >
          Lesson
        </Label>
        <Select defaultValue={lessonObjective?.lessonId} name="lessonId">
          <SelectTrigger
            className={cn(errors?.lessonId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a lesson" />
          </SelectTrigger>
          <SelectContent>
          {lessons?.map((lesson) => (
            <SelectItem key={lesson.id} value={lesson.id.toString()}>
              {lesson.id}{/* TODO: Replace with a field from the lesson model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.lessonId ? (
          <p className="text-xs text-destructive mt-2">{errors.lessonId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: lessonObjective });
              const error = await deleteLessonObjectiveAction(lessonObjective.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: lessonObjective,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default LessonObjectiveForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
