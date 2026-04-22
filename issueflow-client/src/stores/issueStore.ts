import { create } from "zustand";
import type { Issue } from "@/types";
import * as issueService from "@/services/issueService";

type IssueState = {
  issues: Issue[];
  page: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;

  search: string;
  statusFilter: string;
  priorityFilter: string;

  fetchIssues: (overrides?: { page?: number; limit?: number }) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  resetFilters: () => void;
  createIssue: (data: {
    title: string;
    description?: string;
    priority?: string;
    severity?: string;
    assignee?: string;
  }) => Promise<void>;
  updateIssueStatus: (id: string, status: string) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
};

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  page: 1,
  totalPages: 1,
  totalCount: 0,
  isLoading: false,
  error: null,
  search: "",
  statusFilter: "",
  priorityFilter: "",

  fetchIssues: async (overrides) => {
    const state = get();
    set({ isLoading: true, error: null });
    try {
      const res = await issueService.getIssues({
        page: overrides?.page ?? state.page,
        limit: overrides?.limit ?? 10,
        search: state.search || undefined,
        status: state.statusFilter || undefined,
        priority: state.priorityFilter || undefined,
      });
      set({
        issues: res.issues,
        page: res.page,
        totalPages: res.totalPages,
        totalCount: res.totalCount,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch issues",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchIssues({ page });
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchIssues({ page: 1 });
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, page: 1 });
    get().fetchIssues({ page: 1 });
  },

  setPriorityFilter: (priority) => {
    set({ priorityFilter: priority, page: 1 });
    get().fetchIssues({ page: 1 });
  },

  resetFilters: () => {
    set({ search: "", statusFilter: "", priorityFilter: "", page: 1 });
    get().fetchIssues({ page: 1 });
  },

  createIssue: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await issueService.createIssue(data);
      set({ page: 1 });
      await get().fetchIssues({ page: 1 });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create issue",
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateIssueStatus: async (id, status) => {
    set({ error: null });
    try {
      await issueService.updateIssueStatus(id, status);
      await get().fetchIssues();
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to update issue status",
      });
      throw err;
    }
  },

  deleteIssue: async (id) => {
    set({ error: null });
    try {
      await issueService.deleteIssue(id);
      await get().fetchIssues();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete issue",
      });
      throw err;
    }
  },
}));
