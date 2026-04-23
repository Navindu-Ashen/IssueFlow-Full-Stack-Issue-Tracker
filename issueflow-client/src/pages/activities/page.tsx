"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActivityStore } from "@/stores/activityStore";
import type { Activity } from "@/types";
import { formatDate } from "@/lib/issue-utils";

export default function ActivitiesPage() {
  const {
    activities,
    page,
    limit,
    totalPages,
    totalCount,
    isLoading,
    error,
    hasFetched,
    fetchActivities,
    setPage,
  } = useActivityStore();

  useEffect(() => {
    if (!hasFetched) {
      fetchActivities();
    }
  }, [fetchActivities, hasFetched]);

  const pageStartItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const pageEndItem = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-6">
      <div className="rounded-xl border border-[#9D5FD4]/20 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#9D5FD4]/15 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#5F2C8A]">
                Recent Activities
              </h2>
              <p className="text-sm text-muted-foreground">
                Track all actions across your issues
              </p>
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
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading activities...
                  </TableCell>
                </TableRow>
              ) : activities.length ? (
                activities.map((activity: Activity) => (
                  <TableRow
                    key={activity._id}
                    className="hover:bg-[#9D5FD4]/5"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {activity.userId?.profilePictureUrl && (
                          <img
                            src={activity.userId.profilePictureUrl}
                            alt={activity.userId.name || "User"}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        )}
                        <span>{activity.userId?.name || "Unknown User"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#9D5FD4]/10 text-[#5F2C8A] border-[#9D5FD4]/20">
                        {activity.action.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate font-medium" title={activity.issueId?.title}>
                        {activity.action === "DELETED" ? "Deleted Issue" : (activity.issueId?.title || "Unknown Issue")}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate text-sm text-muted-foreground" title={activity.details}>
                        {activity.details}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(activity.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No activities found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#9D5FD4]/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {pageStartItem} – {pageEndItem} of {totalCount} activities
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
  );
}
