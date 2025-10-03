
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuizHistory {
  id: string;
  quizName: string;
  points: number;
  correctAnswers: number;
  wrongAnswers: number;
  completionDate: string;
  totalQuestions: number;
}

function PerformanceBadge({
  correct,
  total,
}: {
  correct: number;
  total: number;
}) {
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  if (percentage >= 80) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <TrendingUp className="mr-1 h-3 w-3" />
        Excellent
      </Badge>
    );
  }
  if (percentage >= 60) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <Minus className="mr-1 h-3 w-3" />
        Good
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <TrendingDown className="mr-1 h-3 w-3" />
      Needs Improvement
    </Badge>
  );
}

export default function QuizHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const firestore = useFirestore();

  const quizHistoryQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'quiz_history'),
      orderBy('completionDate', 'desc')
    );
  }, [firestore, user]);

  const {
    data: quizHistory,
    isLoading: historyLoading,
    error,
  } = useCollection<QuizHistory>(quizHistoryQuery);
  const isLoading = authLoading || historyLoading;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Quiz History</h1>
      <p className="text-muted-foreground mb-8">
        Review your past quiz performance and track your progress.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>My Quizzes</CardTitle>
          <CardDescription>
            A log of all the quizzes you have completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Topic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                       <Skeleton className="h-6 w-24 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && quizHistory && quizHistory.length > 0 ? (
                quizHistory.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium truncate max-w-xs">{quiz.quizName}</TableCell>
                    <TableCell>
                      {format(new Date(quiz.completionDate), 'PPP')}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {quiz.correctAnswers} / {quiz.totalQuestions}
                    </TableCell>
                    <TableCell className="text-center">
                      <PerformanceBadge correct={quiz.correctAnswers} total={quiz.totalQuestions} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      You haven't completed any quizzes yet.
                    </TableCell>
                  </TableRow>
                )
              )}
               {error && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-destructive">
                      Error loading quiz history. Please try again later.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
