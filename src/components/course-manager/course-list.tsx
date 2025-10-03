'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { Course } from '@/lib/types';
import CourseItem from './course-item';

export default function CourseList() {
  const { user } = useUser();
  const firestore = useFirestore();

  const coursesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'courses'),
      orderBy('addedAt', 'desc')
    );
  }, [user, firestore]);

  const { data: courses, isLoading, error } = useCollection<Course>(coursesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
        <CardDescription>
          A list of all your enrolled courses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          )}

          {!isLoading && courses && courses.length > 0 && (
            courses.map(course => <CourseItem key={course.id} course={course} />)
          )}

          {!isLoading && (!courses || courses.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                You haven't added any courses yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the form to start tracking your learning journey!
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-destructive">
                <p>Error loading courses. Please try again later.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
