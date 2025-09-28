import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CopyButton from '../copy-button';
import { MessageSquare, Users, Briefcase } from 'lucide-react';

const templates = [
  {
    title: 'Connect with someone in your industry',
    content:
      "Hi [Name], I came across your profile and was impressed by your work at [Company]. I'm also in the [Industry] space and would love to connect and follow your work. Best, [Your Name]",
  },
  {
    title: 'Follow-up after a networking event',
    content:
      'Hi [Name], it was great meeting you at [Event Name] yesterday. I enjoyed our conversation about [Topic]. I\'d love to stay connected and learn more about your work. Best, [Your Name]',
  },
  {
    title: 'Connect with a recruiter',
    content:
      'Hi [Name], I saw that you recruit for roles in [Field, e.g., software engineering] at [Company]. I am a [Your Role] with experience in [Key Skills] and am actively exploring new opportunities. Would be great to connect. Thank you, [Your Name]',
  },
  {
    title: 'Request for an informational interview',
    content:
      'Hi [Name], I\'m inspired by your career path and your work in [Industry/Field]. As someone looking to grow in this area, I would be grateful for the opportunity to ask you a few questions about your experience. Would you be open to a brief 15-minute chat? Best, [Your Name]',
  },
];

export default function ConnectionTemplates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Message Templates</CardTitle>
        <CardDescription>
          Ready-to-use templates for networking on LinkedIn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {templates.map((template, i) => (
            <AccordionItem value={`item-${i}`} key={i}>
              <AccordionTrigger className="text-left">
                {template.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {template.content}
                  </p>
                  <CopyButton textToCopy={template.content} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
