import { Suspense } from "react";

import Loading from "@/app/loading";
import LessonList from "@/components/lessons/LessonList";
import { getLessons } from "@/lib/api/lessons/queries";
import { getCourses } from "@/lib/api/courses/queries";

export const revalidate = 0;

export default async function LessonsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Lessons</h1>
        </div>
        <Lessons />
      </div>
    </main>
  );
}

const Lessons = async () => {
  
  const { lessons } = await getLessons();
  const { courses } = await getCourses();
  return (
    <Suspense fallback={<Loading />}>
      <LessonList lessons={lessons} courses={courses} />
    </Suspense>
  );
};
