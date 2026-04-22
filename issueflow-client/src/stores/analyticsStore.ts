import { create } from "zustand";
import type { IssueStatusCounts, IssuesCreatedLast7Days } from "@/types";
import * as analyticsService from "@/services/analyticsService";

type AnalyticsState = {
  issuesCreatedLast7Days: IssuesCreatedLast7Days | null;
  issueStatusCounts: IssueStatusCounts | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  issuesCreatedLast7Days: null,
  issueStatusCounts: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsService.getAnalytics();
      set({
        issuesCreatedLast7Days: data.issuesCreatedLast7Days,
        issueStatusCounts: data.issueStatusCounts,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch analytics",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
