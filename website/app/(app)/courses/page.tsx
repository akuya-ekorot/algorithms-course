import { Suspense } from "react";

import Loading from "@/app/loading";
import CourseList from "@/components/courses/CourseList";
import { getCourses } from "@/lib/api/courses/queries";


export const revalidate = 0;

export default async function CoursesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Courses</h1>
        </div>
        <Courses />
      </div>
    </main>
  );
}

const Courses = async () => {
  
  const { courses } = await getCourses();
  
  return (
    <Suspense fallback={<Loading />}>
      <CourseList courses={courses}  />
    </Suspense>
  );
};
