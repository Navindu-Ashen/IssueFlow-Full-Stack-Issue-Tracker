import type { IssueStatus, IssueSeverity, IssuePriority, User } from "@/types";

export function getStatusBadgeClass(status: IssueStatus): string {
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

export function getSeverityBadgeClass(severity: IssueSeverity): string {
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

export function getPriorityBadgeClass(priority: IssuePriority): string {
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

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCreatorName(createdBy: User | string): string {
  if (typeof createdBy === "object" && createdBy !== null) return createdBy.name;
  return "Unknown";
}

export function getAssigneeName(assignee: User | string | null): string {
  if (!assignee) return "Unassigned";
  if (typeof assignee === "object") return assignee.name;
  return assignee;
}
