"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DashboardSourceRow = {
  id: number;
  header: string;
  type: string;
  status: string;
  reviewer: string;
};

type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";

type IssueRow = {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  statu: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "Low" | "Medium" | "High" | "Urgent";
  createdBy: string;
  date: string;
};

const statusOptions: Array<"All" | IssueStatus> = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

const severityCycle: IssueRow["severity"][] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const priorityCycle: IssueRow["priority"][] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

function normalizeStatus(status: string, id: number): IssueStatus {
  const value = status.toLowerCase();

  if (value.includes("done")) return "Resolved";
  if (value.includes("process") || value.includes("progress"))
    return "In Progress";

  // Keep some "Closed" examples so the filter has data
  if (id % 7 === 0) return "Closed";

  return "Open";
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadgeClass(status: IssueStatus) {
  switch (status) {
    case "Open":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "In Progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Closed":
      return "bg-slate-100 text-slate-700 border-slate-300";
    default:
      return "";
  }
}

function getSeverityBadgeClass(severity: IssueRow["severity"]) {
  switch (severity) {
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "Medium":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "High":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Critical":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "";
  }
}

function getPriorityBadgeClass(priority: IssueRow["priority"]) {
  switch (priority) {
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "Medium":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "High":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "Urgent":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "";
  }
}

function mapToIssueRows(data: DashboardSourceRow[]): IssueRow[] {
  const referenceDate = new Date();

  return data
    .map((item, index) => {
      const issueDate = new Date(referenceDate);
      issueDate.setDate(referenceDate.getDate() - index);

      return {
        id: item.id,
        title: item.header,
        description: `Update required for ${item.type.toLowerCase()} section and validation checks.`,
        status: normalizeStatus(item.status, item.id),
        statu: item.type,
        severity: severityCycle[index % severityCycle.length],
        priority: priorityCycle[index % priorityCycle.length],
        createdBy:
          item.reviewer && item.reviewer !== "Assign reviewer"
            ? item.reviewer
            : "Unassigned",
        date: formatDate(issueDate),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
}

export function DataTable({ data }: { data: DashboardSourceRow[] }) {
  const [statusFilter, setStatusFilter] = React.useState<"All" | IssueStatus>(
    "All",
  );

  const latestIssues = React.useMemo(() => mapToIssueRows(data), [data]);

  const filteredIssues = React.useMemo(() => {
    if (statusFilter === "All") return latestIssues;
    return latestIssues.filter((issue) => issue.status === statusFilter);
  }, [latestIssues, statusFilter]);

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border border-[#9D5FD4]/20 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#9D5FD4]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#5F2C8A]">
              Latest Issues
            </h2>
            <p className="text-sm text-muted-foreground">
              Recent issues across your project
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "All" | IssueStatus)
              }
            >
              <SelectTrigger className="w-[170px] border-[#9D5FD4]/30">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              asChild
              className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
            >
              <a href="/issues">View All Issues</a>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#9D5FD4]/5 hover:bg-[#9D5FD4]/5">
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Statu</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="max-w-[320px]">
                      <div className="font-medium">{issue.title}</div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {issue.description}
                      </p>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(issue.status)}
                      >
                        {issue.status}
                      </Badge>
                    </TableCell>

                    <TableCell>{issue.statu}</TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getSeverityBadgeClass(issue.severity)}
                      >
                        {issue.severity}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getPriorityBadgeClass(issue.priority)}
                      >
                        {issue.priority}
                      </Badge>
                    </TableCell>

                    <TableCell>{issue.createdBy}</TableCell>
                    <TableCell>{issue.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No issues found for selected status.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
