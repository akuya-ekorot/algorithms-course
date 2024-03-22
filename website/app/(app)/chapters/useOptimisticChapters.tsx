import { type Lesson } from "@/lib/db/schema/lessons";
import { type Chapter, type CompleteChapter } from "@/lib/db/schema/chapters";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Chapter>) => void;

export const useOptimisticChapters = (
  chapters: CompleteChapter[],
  lessons: Lesson[]
) => {
  const [optimisticChapters, addOptimisticChapter] = useOptimistic(
    chapters,
    (
      currentState: CompleteChapter[],
      action: OptimisticAction<Chapter>,
    ): CompleteChapter[] => {
      const { data } = action;

      const optimisticLesson = lessons.find(
        (lesson) => lesson.id === data.lessonId,
      )!;

      const optimisticChapter = {
        ...data,
        lesson: optimisticLesson,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticChapter]
            : [...currentState, optimisticChapter];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticChapter } : item,
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

  return { addOptimisticChapter, optimisticChapters };
};
