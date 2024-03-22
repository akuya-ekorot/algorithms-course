import { type Lesson } from "@/lib/db/schema/lessons";
import { type LessonReference, type CompleteLessonReference } from "@/lib/db/schema/lessonReferences";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<LessonReference>) => void;

export const useOptimisticLessonReferences = (
  lessonReferences: CompleteLessonReference[],
  lessons: Lesson[]
) => {
  const [optimisticLessonReferences, addOptimisticLessonReference] = useOptimistic(
    lessonReferences,
    (
      currentState: CompleteLessonReference[],
      action: OptimisticAction<LessonReference>,
    ): CompleteLessonReference[] => {
      const { data } = action;

      const optimisticLesson = lessons.find(
        (lesson) => lesson.id === data.lessonId,
      )!;

      const optimisticLessonReference = {
        ...data,
        lesson: optimisticLesson,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticLessonReference]
            : [...currentState, optimisticLessonReference];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticLessonReference } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticLessonReference, optimisticLessonReferences };
};
