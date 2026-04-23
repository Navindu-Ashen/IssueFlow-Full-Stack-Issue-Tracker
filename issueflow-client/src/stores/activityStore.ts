import { create } from "zustand";
import type { Activity } from "@/types";
import * as activityService from "@/services/activityService";

type ActivityState = {
  activities: Activity[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;

  hasFetched: boolean;

  fetchActivities: (overrides?: { page?: number; limit?: number }) => Promise<void>;
  setPage: (page: number) => void;
};

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  page: 1,
  limit: 10,
  totalPages: 1,
  totalCount: 0,
  isLoading: false,
  error: null,
  hasFetched: false,

  fetchActivities: async (overrides) => {
    const state = get();
    set({ isLoading: true, error: null });
    try {
      const res = await activityService.getActivities({
        page: overrides?.page ?? state.page,
        limit: overrides?.limit ?? state.limit,
      });
      set({
        activities: res.activities,
        page: res.page,
        limit: res.limit,
        totalPages: res.totalPages,
        totalCount: res.totalCount,
        hasFetched: true,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch activities",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setPage: (page) => {
    const limit = get().limit;
    set({ page });
    get().fetchActivities({ page, limit });
  },
}));
