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
import { Label } from "@/components/ui/label";
import type { Issue, IssueStatus } from "@/types";
import {
  getStatusBadgeClass,
  getSeverityBadgeClass,
  getPriorityBadgeClass,
  formatDate,
  getCreatorName,
  getAssigneeName,
} from "@/lib/issue-utils";

interface IssueDetailsDialogProps {
  issue: Issue | null;
  onOpenChange: (open: boolean) => void;
  onSaveStatus: (id: string, status: IssueStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function IssueDetailsDialog({
  issue,
  onOpenChange,
  onSaveStatus,
  onDelete,
}: IssueDetailsDialogProps) {
  const [editingStatus, setEditingStatus] = useState<IssueStatus>("Open");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    if (issue) {
      setEditingStatus(issue.status);
      setIsDeleting(false);
    }
  }, [issue]);

  async function handleSaveStatus() {
    if (!issue) return;
    setIsSaveLoading(true);
    try {
      await onSaveStatus(issue._id, editingStatus);
    } finally {
      setIsSaveLoading(false);
    }
  }

  function handleDeleteClick() {
    setIsDeleting(true);
  }

  async function handleConfirmDelete() {
    if (!issue) return;
    setIsDeleteLoading(true);
    try {
      await onDelete(issue._id);
      setIsDeleting(false);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  function handleCancelDelete() {
    setIsDeleting(false);
  }

  return (
    <Dialog open={!!issue} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {issue ? (
          <>
            <DialogHeader>
              <DialogTitle>{issue.title}</DialogTitle>
              <DialogDescription>
                Created {formatDate(issue.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">
                  {issue.description || "No description provided."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Created By</p>
                  <p className="mt-1 font-medium">
                    {getCreatorName(issue.createdBy)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Assignee</p>
                  <p className="mt-1 font-medium">
                    {getAssigneeName(issue.assignee)}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={getSeverityBadgeClass(issue.severity)}
                    >
                      {issue.severity}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={getPriorityBadgeClass(issue.priority)}
                    >
                      {issue.priority}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(issue.status)}
                    >
                      {issue.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Update Status</Label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "Open",
                      "In Progress",
                      "Resolved",
                      "Closed",
                    ] as IssueStatus[]
                  ).map((status) => {
                    const isSelected = editingStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingStatus(status);
                        }}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                          isSelected
                            ? getStatusBadgeClass(status) +
                              " ring-2 ring-primary/20 ring-offset-2 scale-105"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="flex w-full mt-4 items-center justify-between sm:justify-between">
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-destructive">
                    Are you sure?
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleConfirmDelete}
                    disabled={isDeleteLoading}
                  >
                    {isDeleteLoading ? "Deleting..." : "Yes, Delete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="destructive" onClick={handleDeleteClick}>
                  Delete
                </Button>
              )}

              {!isDeleting && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                  <Button
                    className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                    onClick={handleSaveStatus}
                    disabled={editingStatus === issue.status || isSaveLoading}
                  >
                    {isSaveLoading ? "Saving..." : "Save Status"}
                  </Button>
                </div>
              )}
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
