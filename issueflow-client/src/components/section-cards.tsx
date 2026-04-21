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

type DashboardRow = {
  id: number;
  status: string;
};

type SectionCardsProps = {
  data?: DashboardRow[];
};

type NormalizedStatus = "open" | "inProgress" | "resolved" | "closed";

function normalizeStatus(rawStatus: string): NormalizedStatus {
  const value = rawStatus.trim().toLowerCase();

  if (value.includes("closed")) return "closed";
  if (value.includes("done") || value.includes("resolved")) return "resolved";
  if (value.includes("process") || value.includes("progress"))
    return "inProgress";

  return "open";
}

export function SectionCards({ data = [] }: SectionCardsProps) {
  const totals = data.reduce(
    (acc, item) => {
      const normalized = normalizeStatus(item.status);

      if (normalized === "open") acc.open += 1;
      if (normalized === "inProgress") acc.inProgress += 1;
      if (normalized === "resolved") acc.resolved += 1;
      if (normalized === "closed") acc.closed += 1;

      acc.total += 1;
      return acc;
    },
    { open: 0, inProgress: 0, resolved: 0, closed: 0, total: 0 },
  );

  const issueStats = [
    {
      title: "Open Issues",
      value: totals.open,
      hint: "Needs triage or assignment",
      icon: AlertCircleIcon,
    },
    {
      title: "In Progress Issues",
      value: totals.inProgress,
      hint: "Currently being worked on",
      icon: LoaderCircleIcon,
    },
    {
      title: "Resolved Issues",
      value: totals.resolved,
      hint: "Fixed and ready to close",
      icon: CheckCircle2Icon,
    },
    {
      title: "Total Issues",
      value: totals.total,
      hint: "All issues across statuses",
      icon: ListTodoIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {issueStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="border-[#9D5FD4]/20 bg-gradient-to-br from-[#9D5FD4]/10 via-white to-white shadow-sm"
          >
            <CardHeader className="pb-3">
              <CardDescription className="text-[#7E45B1]">
                {stat.title}
              </CardDescription>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-3xl font-semibold tracking-tight text-[#5F2C8A]">
                  {stat.value}
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
