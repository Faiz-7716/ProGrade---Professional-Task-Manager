'use client';
import { useState } from 'react';
import { Course } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import EditCourseDialog from './edit-course-dialog';
import DeleteCourseDialog from './delete-course-dialog';

const statusColors: { [key: string]: string } = {
  Ongoing: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  'Not Started': 'bg-gray-100 text-gray-800',
};

interface CourseItemProps {
  course: Course;
}

export default function CourseItem({ course }: CourseItemProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const progress =
    course.totalModules > 0
      ? (course.modulesCompleted / course.totalModules) * 100
      : 0;
  return (
    <div className="border p-4 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">{course.name}</h3>
          <p className="text-sm text-muted-foreground">{course.platform}</p>
        </div>
        <Badge className={statusColors[course.status]}>{course.status}</Badge>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-sm font-medium">
            {course.modulesCompleted} / {course.totalModules} modules
          </p>
        </div>
        <Progress value={progress} />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>

      <EditCourseDialog isOpen={isEditDialogOpen} setIsOpen={setEditDialogOpen} course={course} />
      <DeleteCourseDialog isOpen={isDeleteDialogOpen} setIsOpen={setDeleteDialogOpen} courseId={course.id} courseName={course.name} />
    </div>
  );
}
