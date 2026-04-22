"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateIssueDialog } from "../../components/create-issue-dialog";
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
  IssueStatus,
  IssuePriority,
  IssueSeverity,
  User,
} from "@/types";

const statusOptions: Array<"All" | IssueStatus> = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

const priorityFilterOptions: Array<"All" | IssuePriority> = [
  "All",
  "Low",
  "Medium",
  "High",
];

function getStatusBadgeClass(status: IssueStatus): string {
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

function getSeverityBadgeClass(severity: IssueSeverity): string {
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

function getPriorityBadgeClass(priority: IssuePriority): string {
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCreatorName(createdBy: User | string): string {
  if (typeof createdBy === "object" && createdBy !== null)
    return createdBy.name;
  return "Unknown";
}

function getAssigneeName(assignee: User | string | null): string {
  if (!assignee) return "Unassigned";
  if (typeof assignee === "object") return assignee.name;
  return assignee;
}

export default function IssuesPage() {
  const {
    issues,
    page,
    totalPages,
    totalCount,
    isLoading,
    error,
    search,
    statusFilter,
    priorityFilter,
    fetchIssues,
    setPage,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    resetFilters,
    updateIssueStatus,
    deleteIssue,
  } = useIssueStore();

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [editingStatus, setEditingStatus] = useState<"Resolved" | "Closed">(
    "Resolved",
  );

  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search, setSearch]);

  function handleOpenDetails(issue: Issue) {
    setSelectedIssue(issue);
    setEditingStatus("Resolved");
  }

  async function handleSaveStatus() {
    if (!selectedIssue) return;
    try {
      await updateIssueStatus(selectedIssue._id, editingStatus);
      setSelectedIssue(null);
    } catch {
      // error set in store
    }
  }

  async function handleDeleteIssue() {
    if (!selectedIssue) return;
    try {
      await deleteIssue(selectedIssue._id);
      setSelectedIssue(null);
    } catch {
      // error set in store
    }
  }

  function handleClearFilters() {
    setSearchInput("");
    resetFilters();
  }

  const pageSize = 10;
  const pageStartItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEndItem = Math.min(page * pageSize, totalCount);

  return (
    <>
      <div className="flex flex-1 flex-col p-4 lg:p-6">
        <div className="rounded-xl border border-[#9D5FD4]/20 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#9D5FD4]/15 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#5F2C8A]">
                  All Issues
                </h2>
                <p className="text-sm text-muted-foreground">
                  Track, filter, and update issue statuses
                </p>
              </div>

              <Button
                className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                onClick={() => setIsCreateOpen(true)}
              >
                Create Issue
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center gap-2">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title..."
                  className="max-w-md border-[#9D5FD4]/30"
                />
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground mr-2">
                    Status:
                  </span>
                  {statusOptions.map((status) => {
                    const isActive = (statusFilter || "All") === status;
                    return (
                      <button
                        key={status}
                        onClick={() =>
                          setStatusFilter(status === "All" ? "" : status)
                        }
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          isActive
                            ? "bg-[#9D5FD4] hover:bg-[#8B4FC3] text-white border-transparent"
                            : "bg-transparent text-foreground hover:bg-muted border-input"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground mr-2">
                    Priority:
                  </span>
                  {priorityFilterOptions.map((priority) => {
                    const isActive = (priorityFilter || "All") === priority;
                    return (
                      <button
                        key={priority}
                        onClick={() =>
                          setPriorityFilter(priority === "All" ? "" : priority)
                        }
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          isActive
                            ? "bg-[#9D5FD4] hover:bg-[#8B4FC3] text-white border-transparent"
                            : "bg-transparent text-foreground hover:bg-muted border-input"
                        }`}
                      >
                        {priority}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#9D5FD4]/5 hover:bg-[#9D5FD4]/5">
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Loading issues...
                    </TableCell>
                  </TableRow>
                ) : issues.length ? (
                  issues.map((issue: Issue) => (
                    <TableRow
                      key={issue._id}
                      className="cursor-pointer hover:bg-[#9D5FD4]/5"
                      onClick={() => handleOpenDetails(issue)}
                    >
                      <TableCell className="max-w-[300px]">
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
                      <TableCell>{getCreatorName(issue.createdBy)}</TableCell>
                      <TableCell>{getAssigneeName(issue.assignee)}</TableCell>
                      <TableCell>{formatDate(issue.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No issues found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#9D5FD4]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {pageStartItem} – {pageEndItem} of {totalCount} issues
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CreateIssueDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <Dialog
        open={!!selectedIssue}
        onOpenChange={(open) => !open && setSelectedIssue(null)}
      >
        <DialogContent className="max-w-xl">
          {selectedIssue ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedIssue.title}</DialogTitle>
                <DialogDescription>
                  Created {formatDate(selectedIssue.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">
                    {selectedIssue.description || "No description provided."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Created By</p>
                    <p className="mt-1 font-medium">
                      {getCreatorName(selectedIssue.createdBy)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Assignee</p>
                    <p className="mt-1 font-medium">
                      {getAssigneeName(selectedIssue.assignee)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select
                      value={editingStatus}
                      onValueChange={(value) =>
                        setEditingStatus(value as "Resolved" | "Closed")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Badge
                      variant="outline"
                      className={getSeverityBadgeClass(selectedIssue.severity)}
                    >
                      {selectedIssue.severity}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getPriorityBadgeClass(selectedIssue.priority)}
                    >
                      {selectedIssue.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(selectedIssue.status)}
                    >
                      {selectedIssue.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button variant="destructive" onClick={handleDeleteIssue}>
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedIssue(null)}
                >
                  Close
                </Button>
                <Button
                  className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                  onClick={handleSaveStatus}
                >
                  Save Status
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
