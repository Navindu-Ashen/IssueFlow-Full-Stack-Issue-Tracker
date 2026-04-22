"use client";

import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ListTodoIcon,
  LoaderCircleIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAnalyticsStore } from "@/stores/analyticsStore";

export function SectionCards() {
  const { issueStatusCounts, isLoading } = useAnalyticsStore();

  const counts = issueStatusCounts ?? {
    open: 0,
    inProgress: 0,
    resolved: 0,
    totalAvailable: 0,
  };

  const issueStats = [
    {
      title: "Open Issues",
      value: counts.open,
      hint: "Needs triage or assignment",
      icon: AlertCircleIcon,
    },
    {
      title: "In Progress Issues",
      value: counts.inProgress,
      hint: "Currently being worked on",
      icon: LoaderCircleIcon,
    },
    {
      title: "Resolved Issues",
      value: counts.resolved,
      hint: "Fixed and ready to close",
      icon: CheckCircle2Icon,
    },
    {
      title: "Total Issues",
      value: counts.totalAvailable,
      hint: "All issues across statuses",
      icon: ListTodoIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {issueStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title} className="border-[#9D5FD4]/20 bg-white">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#7E45B1]">
                {stat.title}
              </CardDescription>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-3xl font-semibold tracking-tight text-[#5F2C8A]">
                  {isLoading ? "–" : stat.value}
                </CardTitle>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9D5FD4]/15 text-[#9D5FD4]">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
