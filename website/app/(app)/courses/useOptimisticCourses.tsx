
import { type Course, type CompleteCourse } from "@/lib/db/schema/courses";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Course>) => void;

export const useOptimisticCourses = (
  courses: CompleteCourse[],
  
) => {
  const [optimisticCourses, addOptimisticCourse] = useOptimistic(
    courses,
    (
      currentState: CompleteCourse[],
      action: OptimisticAction<Course>,
    ): CompleteCourse[] => {
      const { data } = action;

      

      const optimisticCourse = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticCourse]
            : [...currentState, optimisticCourse];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticCourse } : item,
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

  return { addOptimisticCourse, optimisticCourses };
};
