import { type Lesson } from '@/lib/db/schema/lessons';
import {
  type LessonObjective,
  type CompleteLessonObjective,
} from '@/lib/db/schema/lessonObjectives';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<LessonObjective>,
) => void;

export const useOptimisticLessonObjectives = (
  lessonObjectives: CompleteLessonObjective[],
  lessons: Lesson[],
) => {
  const [optimisticLessonObjectives, addOptimisticLessonObjective] =
    useOptimistic(
      lessonObjectives,
      (
        currentState: CompleteLessonObjective[],
        action: OptimisticAction<LessonObjective>,
      ): CompleteLessonObjective[] => {
        const { data } = action;

        const optimisticLesson = lessons.find(
          (lesson) => lesson.id === data.lessonId,
        )!;

        const optimisticLessonObjective = {
          ...data,
          lesson: optimisticLesson,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticLessonObjective]
              : [...currentState, optimisticLessonObjective];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticLessonObjective }
                : item,
            );
          case 'delete':
            return currentState.map((item) =>
              item.id === data.id ? { ...item, id: 'delete' } : item,
            );
          default:
            return currentState;
        }
      },
    );

  return { addOptimisticLessonObjective, optimisticLessonObjectives };
};
