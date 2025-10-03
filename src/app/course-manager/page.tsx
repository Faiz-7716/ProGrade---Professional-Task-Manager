
import AddCourseForm from "@/components/course-manager/add-course-form";
import CourseList from "@/components/course-manager/course-list";

export default function CourseManagerPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Course Manager</h1>
            <p className="text-muted-foreground mb-8">
                Add, track, and manage your online courses to stay on top of your learning goals.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <AddCourseForm />
                </div>
                <div className="lg:col-span-2">
                    <CourseList />
                </div>
            </div>
        </div>
    );
}
