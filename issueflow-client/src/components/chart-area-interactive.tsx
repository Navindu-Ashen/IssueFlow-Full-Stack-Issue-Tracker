"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-06-24", issues: 9 },
  { date: "2024-06-25", issues: 12 },
  { date: "2024-06-26", issues: 7 },
  { date: "2024-06-27", issues: 14 },
  { date: "2024-06-28", issues: 11 },
  { date: "2024-06-29", issues: 10 },
  { date: "2024-06-30", issues: 13 },
];

const chartConfig = {
  issues: {
    label: "Total Issues",
    color: "#9D5FD4",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  return (
    <Card className="border-[#9D5FD4]/20">
      <CardHeader>
        <CardTitle>Total Issues</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <LineChart data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />

            <Line
              type="monotone"
              dataKey="issues"
              stroke="var(--color-issues)"
              strokeWidth={3}
              dot={{ r: 3, fill: "var(--color-issues)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
