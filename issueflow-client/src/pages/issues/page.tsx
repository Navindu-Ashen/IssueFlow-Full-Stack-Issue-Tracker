"use client";

import { useMemo, useState, type FormEvent } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import sourceData from "../dashboard/data.json";

type DashboardSourceRow = {
  id: number;
  header: string;
  type: string;
  status: string;
  reviewer: string;
};

type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
type Severity = "Low" | "Medium" | "High" | "Critical";
type Priority = "Low" | "Medium" | "High" | "Urgent";

type IssueRow = {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  type: string;
  severity: Severity;
  priority: Priority;
  createdBy: string;
  createdAt: string;
};

const statusOptions: Array<"All" | IssueStatus> = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

const severityOptions: Array<"All" | Severity> = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];
const priorityOptions: Array<"All" | Priority> = [
  "All",
  "Low",
  "Medium",
  "High",
  "Urgent",
];

const severityCycle: Severity[] = ["Low", "Medium", "High", "Critical"];
const priorityCycle: Priority[] = ["Low", "Medium", "High", "Urgent"];

function normalizeStatus(status: string, id: number): IssueStatus {
  const value = status.toLowerCase();
  if (value.includes("done")) return "Resolved";
  if (value.includes("process") || value.includes("progress"))
    return "In Progress";
  if (id % 8 === 0) return "Closed";
  return "Open";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

function getSeverityBadgeClass(severity: Severity): string {
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

function getPriorityBadgeClass(priority: Priority): string {
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
  const baseDate = new Date();

  return data
    .map((item, index) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - index);

      return {
        id: item.id,
        title: item.header,
        description: `Investigation needed for ${item.type.toLowerCase()} and related validation checks.`,
        status: normalizeStatus(item.status, item.id),
        type: item.type,
        severity: severityCycle[index % severityCycle.length],
        priority: priorityCycle[index % priorityCycle.length],
        createdBy:
          item.reviewer && item.reviewer !== "Assign reviewer"
            ? item.reviewer
            : "Unassigned",
        createdAt: formatDate(date),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueRow[]>(() =>
    mapToIssueRows(sourceData as DashboardSourceRow[]),
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | IssueStatus>("All");
  const [severityFilter, setSeverityFilter] = useState<"All" | Severity>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] = useState<IssueStatus>("Open");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("General");
  const [newSeverity, setNewSeverity] = useState<Severity>("Medium");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newCreatedBy, setNewCreatedBy] = useState("You");

  const filteredIssues = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        !searchValue ||
        issue.title.toLowerCase().includes(searchValue) ||
        issue.description.toLowerCase().includes(searchValue) ||
        issue.type.toLowerCase().includes(searchValue) ||
        issue.createdBy.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || issue.status === statusFilter;
      const matchesSeverity =
        severityFilter === "All" || issue.severity === severityFilter;
      const matchesPriority =
        priorityFilter === "All" || issue.priority === priorityFilter;

      return (
        matchesSearch && matchesStatus && matchesSeverity && matchesPriority
      );
    });
  }, [issues, search, statusFilter, severityFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredIssues.length / pageSize));
  const boundedPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedIssues = useMemo(() => {
    const start = (boundedPage - 1) * pageSize;
    return filteredIssues.slice(start, start + pageSize);
  }, [filteredIssues, boundedPage]);

  const pageStartItem =
    filteredIssues.length === 0 ? 0 : (boundedPage - 1) * pageSize + 1;
  const pageEndItem = Math.min(boundedPage * pageSize, filteredIssues.length);

  const selectedIssue = useMemo(
    () => issues.find((issue) => issue.id === selectedIssueId) ?? null,
    [issues, selectedIssueId],
  );

  function handleOpenDetails(issue: IssueRow) {
    setSelectedIssueId(issue.id);
    setEditingStatus(issue.status);
  }

  function handleSaveStatus() {
    if (!selectedIssue) return;

    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === selectedIssue.id
          ? { ...issue, status: editingStatus }
          : issue,
      ),
    );
    setSelectedIssueId(null);
  }

  function handleCreateIssue(event: FormEvent) {
    event.preventDefault();

    const title = newTitle.trim();
    const description = newDescription.trim();
    if (!title || !description) return;

    const nextId = issues.length ? Math.max(...issues.map((i) => i.id)) + 1 : 1;

    const createdIssue: IssueRow = {
      id: nextId,
      title,
      description,
      status: "Open",
      type: newType.trim() || "General",
      severity: newSeverity,
      priority: newPriority,
      createdBy: newCreatedBy.trim() || "You",
      createdAt: formatDate(new Date()),
    };

    setIssues((prev) => [createdIssue, ...prev]);
    setIsCreateOpen(false);

    setNewTitle("");
    setNewDescription("");
    setNewType("General");
    setNewSeverity("Medium");
    setNewPriority("Medium");
    setNewCreatedBy("You");
    setCurrentPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setSeverityFilter("All");
    setPriorityFilter("All");
    setCurrentPage(1);
  }

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

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search title, description, type..."
                className="lg:col-span-2 border-[#9D5FD4]/30"
              />

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as "All" | IssueStatus);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="border-[#9D5FD4]/30">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={severityFilter}
                onValueChange={(value) => {
                  setSeverityFilter(value as "All" | Severity);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="border-[#9D5FD4]/30">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityOptions.map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Select
                  value={priorityFilter}
                  onValueChange={(value) => {
                    setPriorityFilter(value as "All" | Priority);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="flex-1 border-[#9D5FD4]/30">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#9D5FD4]/5 hover:bg-[#9D5FD4]/5">
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedIssues.length ? (
                  paginatedIssues.map((issue) => (
                    <TableRow
                      key={issue.id}
                      className="cursor-pointer hover:bg-[#9D5FD4]/5"
                      onClick={() => handleOpenDetails(issue)}
                    >
                      <TableCell>#{issue.id}</TableCell>
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
                      <TableCell>{issue.type}</TableCell>
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
                      <TableCell>{issue.createdAt}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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
              Showing {pageStartItem} - {pageEndItem} of{" "}
              {filteredIssues.length} issues
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={boundedPage === 1}
                onClick={() => setCurrentPage(Math.max(1, boundedPage - 1))}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {boundedPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={boundedPage === totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, boundedPage + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Issue</DialogTitle>
            <DialogDescription>
              Add a new issue to the tracker. New issues are created with{" "}
              <strong>Open</strong> status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateIssue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Issue title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <textarea
                id="new-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe the issue..."
                className="min-h-[90px] w-full rounded-lg border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-type">Type</Label>
                <Input
                  id="new-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Technical content"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-created-by">Assignee</Label>
                <Input
                  id="new-created-by"
                  value={newCreatedBy}
                  onChange={(e) => setNewCreatedBy(e.target.value)}
                  placeholder="Assignee name"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select
                  value={newSeverity}
                  onValueChange={(v) => setNewSeverity(v as Severity)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions
                      .filter((s): s is Severity => s !== "All")
                      .map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {severity}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newPriority}
                  onValueChange={(v) => setNewPriority(v as Priority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions
                      .filter((p): p is Priority => p !== "All")
                      .map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedIssue}
        onOpenChange={(open) => !open && setSelectedIssueId(null)}
      >
        <DialogContent className="max-w-xl">
          {selectedIssue ? (
            <>
              <DialogHeader>
                <DialogTitle>Issue #{selectedIssue.id}</DialogTitle>
                <DialogDescription>{selectedIssue.title}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedIssue.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="mt-1 font-medium">{selectedIssue.type}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Created By</p>
                    <p className="mt-1 font-medium">
                      {selectedIssue.createdBy}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select
                      value={editingStatus}
                      onValueChange={(value) =>
                        setEditingStatus(value as IssueStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions
                          .filter((s): s is IssueStatus => s !== "All")
                          .map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
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
                      className={getStatusBadgeClass(editingStatus)}
                    >
                      {editingStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedIssueId(null)}
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
