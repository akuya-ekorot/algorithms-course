import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/lesson-references/useOptimisticLessonReferences';

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

import {
  type LessonReference,
  insertLessonReferenceParams,
} from '@/lib/db/schema/lessonReferences';
import {
  createLessonReferenceAction,
  deleteLessonReferenceAction,
  updateLessonReferenceAction,
} from '@/lib/actions/lessonReferences';
import { type Lesson, type LessonId } from '@/lib/db/schema/lessons';

const LessonReferenceForm = ({
  lessons,
  lessonId,
  lessonReference,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  lessonReference?: LessonReference | null;
  lessons: Lesson[];
  lessonId?: LessonId;
  openModal?: (lessonReference?: LessonReference) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<LessonReference>(insertLessonReferenceParams);
  const editing = !!lessonReference?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('lesson-references');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: LessonReference },
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
      toast.success(`LessonReference ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const lessonReferenceParsed =
      await insertLessonReferenceParams.safeParseAsync({
        lessonId,
        ...payload,
      });
    if (!lessonReferenceParsed.success) {
      setErrors(lessonReferenceParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = lessonReferenceParsed.data;
    const pendingLessonReference: LessonReference = {
      updatedAt: lessonReference?.updatedAt ?? new Date(),
      createdAt: lessonReference?.createdAt ?? new Date(),
      id: lessonReference?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingLessonReference,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateLessonReferenceAction({
              ...values,
              id: lessonReference.id,
            })
          : await createLessonReferenceAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingLessonReference,
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
          defaultValue={lessonReference?.title ?? ''}
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
            errors?.link ? 'text-destructive' : '',
          )}
        >
          Link
        </Label>
        <Input
          type="text"
          name="link"
          className={cn(errors?.link ? 'ring ring-destructive' : '')}
          defaultValue={lessonReference?.link ?? ''}
        />
        {errors?.link ? (
          <p className="text-xs text-destructive mt-2">{errors.link[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {lessonId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.lessonId ? 'text-destructive' : '',
            )}
          >
            Lesson
          </Label>
          <Select defaultValue={lessonReference?.lessonId} name="lessonId">
            <SelectTrigger
              className={cn(errors?.lessonId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a lesson" />
            </SelectTrigger>
            <SelectContent>
              {lessons?.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id.toString()}>
                  {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.lessonId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.lessonId[0]}
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
                addOptimistic({ action: 'delete', data: lessonReference });
              const error = await deleteLessonReferenceAction(
                lessonReference.id,
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: lessonReference,
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

export default LessonReferenceForm;

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
