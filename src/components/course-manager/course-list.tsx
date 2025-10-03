'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
  
  const mockCourses = [
    {
      id: '1',
      name: 'Advanced React Patterns',
      platform: 'Udemy',
      totalModules: 25,
      modulesCompleted: 10,
      status: 'Ongoing',
    },
    {
      id: '2',
      name: 'Introduction to Cybersecurity',
      platform: 'Cisco',
      totalModules: 15,
      modulesCompleted: 15,
      status: 'Completed',
    },
    {
      id: '3',
      name: 'AI for Everyone',
      platform: 'IBM',
      totalModules: 8,
      modulesCompleted: 0,
      status: 'Not Started',
    },
  ];

  const statusColors: { [key: string]: string } = {
    'Ongoing': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Not Started': 'bg-gray-100 text-gray-800',
  }
  
  export default function CourseList() {
    // TODO: Fetch courses from Firestore
    const courses = mockCourses;
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>A list of all your enrolled courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map(course => {
                const progress = course.totalModules > 0 ? (course.modulesCompleted / course.totalModules) * 100 : 0;
                return (
                    <div key={course.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{course.name}</h3>
                                <p className="text-sm text-muted-foreground">{course.platform}</p>
                            </div>
                            <Badge className={statusColors[course.status]}>{course.status}</Badge>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="text-sm font-medium">{course.modulesCompleted} / {course.totalModules} modules</p>
                            </div>
                            <Progress value={progress} />
                        </div>
                    </div>
                )
            })}
             {courses.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">You haven't added any courses yet.</p>
                    <p className="text-sm text-muted-foreground">Use the form to start tracking your learning journey!</p>
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    );
  }
  