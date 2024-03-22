import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/chapters/useOptimisticChapters';

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

import { type Chapter, insertChapterParams } from '@/lib/db/schema/chapters';
import {
  createChapterAction,
  deleteChapterAction,
  updateChapterAction,
} from '@/lib/actions/chapters';
import { type Lesson, type LessonId } from '@/lib/db/schema/lessons';

const ChapterForm = ({
  lessons,
  lessonId,
  chapter,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  chapter?: Chapter | null;
  lessons: Lesson[];
  lessonId?: LessonId;
  openModal?: (chapter?: Chapter) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Chapter>(insertChapterParams);
  const editing = !!chapter?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('chapters');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Chapter },
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
      toast.success(`Chapter ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const chapterParsed = await insertChapterParams.safeParseAsync({
      lessonId,
      ...payload,
    });
    if (!chapterParsed.success) {
      setErrors(chapterParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = chapterParsed.data;
    const pendingChapter: Chapter = {
      updatedAt: chapter?.updatedAt ?? new Date(),
      createdAt: chapter?.createdAt ?? new Date(),
      id: chapter?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingChapter,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateChapterAction({ ...values, id: chapter.id })
          : await createChapterAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingChapter,
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
          defaultValue={chapter?.title ?? ''}
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
          defaultValue={chapter?.description ?? ''}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">
            {errors.description[0]}
          </p>
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
          <Select defaultValue={chapter?.lessonId} name="lessonId">
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
                addOptimistic({ action: 'delete', data: chapter });
              const error = await deleteChapterAction(chapter.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: chapter,
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

export default ChapterForm;

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
