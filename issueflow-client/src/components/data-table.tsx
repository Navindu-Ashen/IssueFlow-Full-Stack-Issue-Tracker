"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { IssueViewDialog } from "@/components/issue-view-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIssueStore } from "@/stores/issueStore";
import type {
  Issue,
  IssuePriority,
  IssueSeverity,
  IssueStatus,
  User,
} from "@/types";

export function getStatusBadgeClass(status: IssueStatus) {
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

export function getSeverityBadgeClass(severity: IssueSeverity) {
  switch (severity) {
    case "Minor":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "Major":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Critical":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "";
  }
}

export function getPriorityBadgeClass(priority: IssuePriority) {
  switch (priority) {
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "Medium":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "High":
      return "bg-violet-50 text-violet-700 border-violet-200";
    default:
      return "";
  }
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getUserDisplayName(user: User | string | null): string {
  if (!user) return "Unassigned";
  if (typeof user === "object") return user.name;
  return user;
}

export function DataTable() {
  const navigate = useNavigate();
  const { issues, isLoading } = useIssueStore();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const isDialogOpen = useMemo(() => selectedIssue !== null, [selectedIssue]);

  const handleOpenIssueDetails = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleNavigateToIssues = () => {
    const id = selectedIssue?._id;
    setSelectedIssue(null);

    if (id) {
      navigate("/issues", { state: { issueId: id } });
      return;
    }

    navigate("/issues");
  };

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border border-[#9D5FD4]/20 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#9D5FD4]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#5F2C8A]">
              Latest Issues
            </h2>
            <p className="text-sm text-muted-foreground">
              Click any issue row to view full details
            </p>
          </div>

          <Button
            asChild
            className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
          >
            <Link to="/issues">View All Issues</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#9D5FD4]/5 hover:bg-[#9D5FD4]/5">
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading issues...
                  </TableCell>
                </TableRow>
              ) : issues.length > 0 ? (
                issues.map((issue: Issue) => (
                  <TableRow
                    key={issue._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenIssueDetails(issue)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenIssueDetails(issue);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-[#9D5FD4]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D5FD4]/40"
                  >
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

                    <TableCell>{getUserDisplayName(issue.createdBy)}</TableCell>
                    <TableCell>{formatDateTime(issue.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No issues found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <IssueViewDialog
        issue={selectedIssue}
        open={isDialogOpen}
        onOpenChange={(open) => !open && setSelectedIssue(null)}
        onMoreDetails={handleNavigateToIssues}
      />
    </div>
  );
}
