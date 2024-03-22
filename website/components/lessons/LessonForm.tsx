import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/lessons/useOptimisticLessons';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { type Lesson, insertLessonParams } from '@/lib/db/schema/lessons';
import {
  createLessonAction,
  deleteLessonAction,
  updateLessonAction,
} from '@/lib/actions/lessons';
import { type Course, type CourseId } from '@/lib/db/schema/courses';

const LessonForm = ({
  courses,
  courseId,
  lesson,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  lesson?: Lesson | null;
  courses: Course[];
  courseId?: CourseId;
  openModal?: (lesson?: Lesson) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Lesson>(insertLessonParams);
  const editing = !!lesson?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('lessons');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Lesson },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Lesson ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const lessonParsed = await insertLessonParams.safeParseAsync({
      courseId,
      ...payload,
    });
    if (!lessonParsed.success) {
      setErrors(lessonParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = lessonParsed.data;
    const pendingLesson: Lesson = {
      updatedAt: lesson?.updatedAt ?? new Date(),
      createdAt: lesson?.createdAt ?? new Date(),
      id: lesson?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingLesson,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateLessonAction({ ...values, id: lesson.id })
          : await createLessonAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingLesson,
        };
        onSuccess(
          editing ? 'update' : 'create',
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
    <form action={handleSubmit} onChange={handleChange} className={'space-y-8'}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.title ? 'text-destructive' : '',
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? 'ring ring-destructive' : '')}
          defaultValue={lesson?.title ?? ''}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.description ? 'text-destructive' : '',
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? 'ring ring-destructive' : '')}
          defaultValue={lesson?.description ?? ''}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">
            {errors.description[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.rank ? 'text-destructive' : '',
          )}
        >
          Rank
        </Label>
        <Input
          type="text"
          name="rank"
          className={cn(errors?.rank ? 'ring ring-destructive' : '')}
          defaultValue={lesson?.rank ?? ''}
        />
        {errors?.rank ? (
          <p className="text-xs text-destructive mt-2">{errors.rank[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {courseId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.courseId ? 'text-destructive' : '',
            )}
          >
            Course
          </Label>
          <Select defaultValue={lesson?.courseId} name="courseId">
            <SelectTrigger
              className={cn(errors?.courseId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.courseId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.courseId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: 'delete', data: lesson });
              const error = await deleteLessonAction(lesson.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: lesson,
              };

              onSuccess('delete', error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? 'ing...' : 'e'}
        </Button>
      ) : null}
    </form>
  );
};

export default LessonForm;

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
        ? `Sav${isUpdating ? 'ing...' : 'e'}`
        : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  );
};
