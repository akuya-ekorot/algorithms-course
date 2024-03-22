import { Suspense } from "react";

import Loading from "@/app/loading";
import CourseObjectiveList from "@/components/courseObjectives/CourseObjectiveList";
import { getCourseObjectives } from "@/lib/api/courseObjectives/queries";
import { getCourses } from "@/lib/api/courses/queries";

export const revalidate = 0;

export default async function CourseObjectivesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Course Objectives</h1>
        </div>
        <CourseObjectives />
      </div>
    </main>
  );
}

const CourseObjectives = async () => {
  
  const { courseObjectives } = await getCourseObjectives();
  const { courses } = await getCourses();
  return (
    <Suspense fallback={<Loading />}>
      <CourseObjectiveList courseObjectives={courseObjectives} courses={courses} />
    </Suspense>
  );
};
