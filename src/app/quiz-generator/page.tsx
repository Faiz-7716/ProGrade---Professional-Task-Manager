
import QuizGenerator from "@/components/dashboard/quiz-generator";

export default function QuizGeneratorPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Knowledge Forge</h1>
            <p className="text-muted-foreground mb-8">
                Solidify what you've learned. Forge your knowledge into expertise with a custom quiz.
            </p>

            <div className="max-w-3xl mx-auto">
                <QuizGenerator />
            </div>
        </div>
    );
}
