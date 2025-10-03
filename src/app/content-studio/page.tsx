
import PostWriter from "@/components/dashboard/post-writer";

export default function ContentStudioPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Content Studio</h1>
            <p className="text-muted-foreground mb-8">
                Your creative space for crafting engaging LinkedIn content.
            </p>

            <div className="max-w-3xl mx-auto">
                <PostWriter />
            </div>
        </div>
    )
}
