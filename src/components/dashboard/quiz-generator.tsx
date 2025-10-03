'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateQuizAction } from '@/app/actions';
import { Loader2, WandSparkles, Sparkles, Check, X } from 'lucide-react';
import { type GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { collection, addDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const formSchema = z.object({
  learningTopic: z
    .string()
    .min(30, 'Please provide more details for a better quiz.'),
});

type QuizState = 'idle' | 'loading' | 'error' | 'in_progress' | 'completed';
type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function QuizGenerator() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [learningTopic, setLearningTopic] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { learningTopic: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuizState('loading');
    setError(null);
    setQuiz(null);
    setLearningTopic(values.learningTopic); // Save the topic
    const res = await generateQuizAction(values);
    if (res.error) {
      setError(res.error);
      setQuizState('error');
    } else if (res.quiz) {
      setQuiz(res.quiz);
      setQuizState('in_progress');
      // Reset scores and counters
      setCurrentQuestionIndex(0);
      setScore(0);
      setCorrectAnswers(0);
      setWrongAnswers(0);
      setSelectedAnswer(null);
      setAnswerState('unanswered');
    }
  }

  const saveQuizHistory = async () => {
    if (!user || !quiz) return;
    try {
      const quizHistoryRef = collection(
        firestore,
        'users',
        user.uid,
        'quiz_history'
      );
      await addDoc(quizHistoryRef, {
        userId: user.uid,
        quizName: learningTopic.substring(0, 50) + '...', // Truncate for a name
        points: score,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        completionDate: new Date().toISOString(),
        totalQuestions: quiz.questions.length,
      });
    } catch (error) {
      console.error('Error saving quiz history:', error);
      // Optionally, show a toast to the user
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !quiz) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const isBonus = currentQuestion.isBonus;

    if (isCorrect) {
      setAnswerState('correct');
      setScore(score + (isBonus ? 2 : 1));
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setAnswerState('incorrect');
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerState('unanswered');
    } else {
      setQuizState('completed');
      await saveQuizHistory();
    }
  };

  const handleRestartQuiz = () => {
    setQuiz(null);
    setQuizState('idle');
    form.reset();
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = quiz
    ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Quiz Generator</CardTitle>
        <CardDescription>
          Test your knowledge with a personalized quiz.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {quizState === 'idle' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="learningTopic"
                render={({ field }) => (
                  <FormItem>
                    <label>What did you learn today?</label>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I learned about the Next.js App Router, how server components work, and the difference between server-side and client-side rendering..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 w-full">
                <WandSparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </Button>
            </form>
          </Form>
        )}

        {quizState === 'loading' && (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Generating your quiz...
            </p>
          </div>
        )}

        {quizState === 'error' && (
          <div className="text-center text-destructive">
            <p>
              <strong>Oops! Something went wrong.</strong>
            </p>
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleRestartQuiz}
            >
              Try Again
            </Button>
          </div>
        )}

        {quizState === 'in_progress' && currentQuestion && quiz && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
              <Progress value={progress} />
            </div>

            <div className="text-lg font-semibold">
              {currentQuestion.isBonus && (
                <div className="flex items-center gap-2 text-accent mb-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold">Bonus Question!</span>
                </div>
              )}
              {currentQuestion.question}
            </div>

            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={setSelectedAnswer}
              disabled={answerState !== 'unanswered'}
            >
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;

                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center space-x-3 space-y-0 rounded-md border p-4 transition-all',
                      answerState === 'unanswered' &&
                        'hover:bg-muted/50 cursor-pointer',
                      answerState !== 'unanswered' &&
                        isCorrect &&
                        'border-green-500 bg-green-500/10',
                      answerState === 'incorrect' &&
                        isSelected &&
                        'border-red-500 bg-red-500/10'
                    )}
                    onClick={() =>
                      answerState === 'unanswered' && setSelectedAnswer(option)
                    }
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <label
                      htmlFor={`option-${index}`}
                      className="font-normal w-full cursor-pointer"
                    >
                      {option}
                    </label>
                    {answerState !== 'unanswered' && isCorrect && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {answerState === 'incorrect' && isSelected && (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>

            {answerState === 'unanswered' ? (
              <Button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="w-full"
              >
                Submit
              </Button>
            ) : (
              <div className="flex flex-col gap-4">
                {answerState === 'correct' && (
                  <div className="text-center font-semibold text-green-600">
                    Correct! {currentQuestion.isBonus && '+2 Bonus Points!'}
                  </div>
                )}
                {answerState === 'incorrect' && (
                  <div className="text-center font-semibold text-red-600">
                    Incorrect. The correct answer is:{' '}
                    {currentQuestion.correctAnswer}
                  </div>
                )}
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestionIndex < quiz.questions.length - 1
                    ? 'Next Question'
                    : 'Finish Quiz'}
                </Button>
              </div>
            )}
          </div>
        )}

        {quizState === 'completed' && quiz && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg">
              You scored{' '}
              <span className="font-bold text-primary">{score}</span> out of{' '}
              <span className="font-bold">
                {quiz.questions.length +
                  (quiz.questions.some((q) => q.isBonus) ? 1 : 0)}
              </span>{' '}
              points.
            </p>
            <Button onClick={handleRestartQuiz}>Take Another Quiz</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
