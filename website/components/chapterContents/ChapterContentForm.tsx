import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/chapter-contents/useOptimisticChapterContents';

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
  type ChapterContent,
  insertChapterContentParams,
} from '@/lib/db/schema/chapterContents';
import {
  createChapterContentAction,
  deleteChapterContentAction,
  updateChapterContentAction,
} from '@/lib/actions/chapterContents';
import { type Chapter, type ChapterId } from '@/lib/db/schema/chapters';

const ChapterContentForm = ({
  chapters,
  chapterId,
  chapterContent,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  chapterContent?: ChapterContent | null;
  chapters: Chapter[];
  chapterId?: ChapterId;
  openModal?: (chapterContent?: ChapterContent) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ChapterContent>(insertChapterContentParams);
  const editing = !!chapterContent?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('chapter-contents');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: ChapterContent },
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
      toast.success(`ChapterContent ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const chapterContentParsed =
      await insertChapterContentParams.safeParseAsync({
        chapterId,
        ...payload,
      });
    if (!chapterContentParsed.success) {
      setErrors(chapterContentParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = chapterContentParsed.data;
    const pendingChapterContent: ChapterContent = {
      updatedAt: chapterContent?.updatedAt ?? new Date(),
      createdAt: chapterContent?.createdAt ?? new Date(),
      id: chapterContent?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingChapterContent,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateChapterContentAction({
              ...values,
              id: chapterContent.id,
            })
          : await createChapterContentAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingChapterContent,
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
            errors?.type ? 'text-destructive' : '',
          )}
        >
          Type
        </Label>
        <Input
          type="text"
          name="type"
          className={cn(errors?.type ? 'ring ring-destructive' : '')}
          defaultValue={chapterContent?.type ?? ''}
        />
        {errors?.type ? (
          <p className="text-xs text-destructive mt-2">{errors.type[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.content ? 'text-destructive' : '',
          )}
        >
          Content
        </Label>
        <Input
          type="text"
          name="content"
          className={cn(errors?.content ? 'ring ring-destructive' : '')}
          defaultValue={chapterContent?.content ?? ''}
        />
        {errors?.content ? (
          <p className="text-xs text-destructive mt-2">{errors.content[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.caption ? 'text-destructive' : '',
          )}
        >
          Caption
        </Label>
        <Input
          type="text"
          name="caption"
          className={cn(errors?.caption ? 'ring ring-destructive' : '')}
          defaultValue={chapterContent?.caption ?? ''}
        />
        {errors?.caption ? (
          <p className="text-xs text-destructive mt-2">{errors.caption[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {chapterId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.chapterId ? 'text-destructive' : '',
            )}
          >
            Chapter
          </Label>
          <Select defaultValue={chapterContent?.chapterId} name="chapterId">
            <SelectTrigger
              className={cn(errors?.chapterId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters?.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id.toString()}>
                  {chapter.id}
                  {/* TODO: Replace with a field from the chapter model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.chapterId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.chapterId[0]}
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
                addOptimistic({ action: 'delete', data: chapterContent });
              const error = await deleteChapterContentAction(chapterContent.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: chapterContent,
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

export default ChapterContentForm;

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
