import { type Chapter } from "@/lib/db/schema/chapters";
import { type ChapterContent, type CompleteChapterContent } from "@/lib/db/schema/chapterContents";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<ChapterContent>) => void;

export const useOptimisticChapterContents = (
  chapterContents: CompleteChapterContent[],
  chapters: Chapter[]
) => {
  const [optimisticChapterContents, addOptimisticChapterContent] = useOptimistic(
    chapterContents,
    (
      currentState: CompleteChapterContent[],
      action: OptimisticAction<ChapterContent>,
    ): CompleteChapterContent[] => {
      const { data } = action;

      const optimisticChapter = chapters.find(
        (chapter) => chapter.id === data.chapterId,
      )!;

      const optimisticChapterContent = {
        ...data,
        chapter: optimisticChapter,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticChapterContent]
            : [...currentState, optimisticChapterContent];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticChapterContent } : item,
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

  return { addOptimisticChapterContent, optimisticChapterContents };
};
