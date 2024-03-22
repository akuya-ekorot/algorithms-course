import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/course-objectives/useOptimisticCourseObjectives";

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

import { type CourseObjective, insertCourseObjectiveParams } from "@/lib/db/schema/courseObjectives";
import {
  createCourseObjectiveAction,
  deleteCourseObjectiveAction,
  updateCourseObjectiveAction,
} from "@/lib/actions/courseObjectives";
import { type Course, type CourseId } from "@/lib/db/schema/courses";

const CourseObjectiveForm = ({
  courses,
  courseId,
  courseObjective,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  courseObjective?: CourseObjective | null;
  courses: Course[];
  courseId?: CourseId
  openModal?: (courseObjective?: CourseObjective) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<CourseObjective>(insertCourseObjectiveParams);
  const editing = !!courseObjective?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("course-objectives");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: CourseObjective },
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
      toast.success(`CourseObjective ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const courseObjectiveParsed = await insertCourseObjectiveParams.safeParseAsync({ courseId, ...payload });
    if (!courseObjectiveParsed.success) {
      setErrors(courseObjectiveParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = courseObjectiveParsed.data;
    const pendingCourseObjective: CourseObjective = {
      updatedAt: courseObjective?.updatedAt ?? new Date(),
      createdAt: courseObjective?.createdAt ?? new Date(),
      id: courseObjective?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingCourseObjective,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateCourseObjectiveAction({ ...values, id: courseObjective.id })
          : await createCourseObjectiveAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingCourseObjective 
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
          defaultValue={courseObjective?.objective ?? ""}
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
          defaultValue={courseObjective?.rank ?? ""}
        />
        {errors?.rank ? (
          <p className="text-xs text-destructive mt-2">{errors.rank[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {courseId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.courseId ? "text-destructive" : "",
          )}
        >
          Course
        </Label>
        <Select defaultValue={courseObjective?.courseId} name="courseId">
          <SelectTrigger
            className={cn(errors?.courseId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
          {courses?.map((course) => (
            <SelectItem key={course.id} value={course.id.toString()}>
              {course.id}{/* TODO: Replace with a field from the course model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.courseId ? (
          <p className="text-xs text-destructive mt-2">{errors.courseId[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: courseObjective });
              const error = await deleteCourseObjectiveAction(courseObjective.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: courseObjective,
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

export default CourseObjectiveForm;

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
