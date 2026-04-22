"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import { useAnalyticsStore } from "@/stores/analyticsStore";

const chartConfig = {
  issues: {
    label: "Total Issues",
    color: "#9D5FD4",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const { issuesCreatedLast7Days } = useAnalyticsStore();

  const chartData = (issuesCreatedLast7Days?.daily ?? []).map((d) => ({
    date: d.date,
    issues: d.count,
  }));

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
          <AreaChart data={chartData} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="fillIssues" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-issues)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-issues)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

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

            <Area
              type="monotone"
              dataKey="issues"
              stroke="var(--color-issues)"
              strokeWidth={3}
              fill="url(#fillIssues)"
              dot={{ r: 3, fill: "var(--color-issues)" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
