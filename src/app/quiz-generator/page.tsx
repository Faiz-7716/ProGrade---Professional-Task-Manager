
import QuizGenerator from "@/components/dashboard/quiz-generator";

export default function QuizGeneratorPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Quiz Generator</h1>
            <p className="text-muted-foreground mb-8">
                Solidify your knowledge. Enter what you learned today, and get a custom quiz.
            </p>

            <div className="max-w-3xl mx-auto">
                <QuizGenerator />
            </div>
        </div>
    );
}
