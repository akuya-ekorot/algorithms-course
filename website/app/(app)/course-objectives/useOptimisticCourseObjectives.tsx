import { type Course } from '@/lib/db/schema/courses';
import {
  type CourseObjective,
  type CompleteCourseObjective,
} from '@/lib/db/schema/courseObjectives';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (
  action: OptimisticAction<CourseObjective>,
) => void;

export const useOptimisticCourseObjectives = (
  courseObjectives: CompleteCourseObjective[],
  courses: Course[],
) => {
  const [optimisticCourseObjectives, addOptimisticCourseObjective] =
    useOptimistic(
      courseObjectives,
      (
        currentState: CompleteCourseObjective[],
        action: OptimisticAction<CourseObjective>,
      ): CompleteCourseObjective[] => {
        const { data } = action;

        const optimisticCourse = courses.find(
          (course) => course.id === data.courseId,
        )!;

        const optimisticCourseObjective = {
          ...data,
          course: optimisticCourse,
          id: 'optimistic',
        };

        switch (action.action) {
          case 'create':
            return currentState.length === 0
              ? [optimisticCourseObjective]
              : [...currentState, optimisticCourseObjective];
          case 'update':
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticCourseObjective }
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

  return { addOptimisticCourseObjective, optimisticCourseObjectives };
};
