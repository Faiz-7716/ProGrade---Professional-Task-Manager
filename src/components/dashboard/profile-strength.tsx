'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { CheckCircle } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

const score = 75;

const chartData = [
  { browser: 'filled', value: score, fill: 'hsl(var(--primary))' },
  { browser: 'empty', value: 100 - score, fill: 'hsl(var(--muted))' },
];

const improvementTips = [
  'Add at least 5 relevant skills to your profile.',
  'Request recommendations from 2-3 former colleagues or managers.',
  'Post an update or share an insightful article this week.',
];

export default function ProfileStrength() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Profile Strength</CardTitle>
        <CardDescription>
          Your current score and tips to improve.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="h-[150px] w-full">
          <ChartContainer config={{}} className="mx-auto aspect-square h-full">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                startAngle={90}
                endAngle={450}
                innerRadius="70%"
                outerRadius="85%"
                cornerRadius={50}
                cy="50%"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold font-headline"
                          >
                            {score}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Good
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="w-full space-y-3 text-sm text-left">
          <h4 className="font-semibold text-center">Improvement Tips:</h4>
          <ul className="space-y-2">
            {improvementTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
