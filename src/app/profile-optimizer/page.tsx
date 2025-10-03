
import AboutSectionCreator from "@/components/dashboard/about-section-creator";
import HeadlineGenerator from "@/components/dashboard/headline-generator";
import ResumeParser from "@/components/dashboard/resume-parser";

export default function ProfileOptimizerPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Profile Optimizer</h1>
            <p className="text-muted-foreground mb-8">
                Tools to enhance your LinkedIn profile and make a great first impression.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HeadlineGenerator />
                <AboutSectionCreator />
                <div className="lg:col-span-2">
                  <ResumeParser />
                </div>
            </div>
        </div>
    )
}
