"use client";

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
import type { Issue } from "@/types";
import {
  getStatusBadgeClass,
  getSeverityBadgeClass,
  getPriorityBadgeClass,
  formatDateTime,
  getUserDisplayName,
} from "@/components/data-table";

interface IssueViewDialogProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoreDetails: () => void;
}

export function IssueViewDialog({
  issue,
  open,
  onOpenChange,
  onMoreDetails,
}: IssueViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="pr-8">
            {issue?.title ?? "Issue Details"}
          </DialogTitle>
          <DialogDescription>
            Full information for the selected issue.
          </DialogDescription>
        </DialogHeader>

        {issue && (
          <div className="grid gap-4 text-sm">
            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="mt-2 whitespace-pre-wrap text-foreground">
                {issue.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={getStatusBadgeClass(issue.status)}
                  >
                    {issue.status}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Priority</p>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={getPriorityBadgeClass(issue.priority)}
                  >
                    {issue.priority}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Severity</p>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={getSeverityBadgeClass(issue.severity)}
                  >
                    {issue.severity}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Created By</p>
                <p className="mt-2 font-medium">
                  {getUserDisplayName(issue.createdBy)}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Assignee</p>
                <p className="mt-2 font-medium">
                  {getUserDisplayName(issue.assignee)}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Issue ID</p>
                <p className="mt-2 break-all font-mono text-xs">
                  {issue._id}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="mt-2 font-medium">
                  {formatDateTime(issue.createdAt)}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Updated At</p>
                <p className="mt-2 font-medium">
                  {formatDateTime(issue.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={onMoreDetails}
            className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
          >
            More Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
