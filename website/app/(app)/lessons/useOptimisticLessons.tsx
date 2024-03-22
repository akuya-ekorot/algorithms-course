import { type Course } from "@/lib/db/schema/courses";
import { type Lesson, type CompleteLesson } from "@/lib/db/schema/lessons";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Lesson>) => void;

export const useOptimisticLessons = (
  lessons: CompleteLesson[],
  courses: Course[]
) => {
  const [optimisticLessons, addOptimisticLesson] = useOptimistic(
    lessons,
    (
      currentState: CompleteLesson[],
      action: OptimisticAction<Lesson>,
    ): CompleteLesson[] => {
      const { data } = action;

      const optimisticCourse = courses.find(
        (course) => course.id === data.courseId,
      )!;

      const optimisticLesson = {
        ...data,
        course: optimisticCourse,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticLesson]
            : [...currentState, optimisticLesson];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticLesson } : item,
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

  return { addOptimisticLesson, optimisticLessons };
};
