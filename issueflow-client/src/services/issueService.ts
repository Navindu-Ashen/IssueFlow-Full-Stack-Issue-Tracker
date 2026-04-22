import { apiClient } from "@/lib/api";
import type { Issue, IssuesResponse } from "@/types";

export type GetIssuesParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
};

function buildQuery(params: GetIssuesParams): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  if (params.status) qs.set("status", params.status);
  if (params.priority) qs.set("priority", params.priority);
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export async function getIssues(
  params: GetIssuesParams = {},
): Promise<IssuesResponse> {
  return apiClient<IssuesResponse>(`/v1/api/issues${buildQuery(params)}`);
}

export async function getIssueById(id: string): Promise<Issue> {
  return apiClient<Issue>(`/v1/api/issues/${id}`);
}

export async function createIssue(data: {
  title: string;
  description?: string;
  priority?: string;
  severity?: string;
  assignee?: string;
}): Promise<Issue> {
  return apiClient<Issue>("/v1/api/issues", {
    method: "POST",
    body: data,
  });
}

export async function updateIssue(
  id: string,
  data: {
    title?: string;
    description?: string;
    assignee?: string;
  },
): Promise<Issue> {
  return apiClient<Issue>(`/v1/api/issues/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function updateIssueStatus(
  id: string,
  status: string,
): Promise<Issue> {
  return apiClient<Issue>(`/v1/api/issues/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteIssue(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/v1/api/issues/${id}`, {
    method: "DELETE",
  });
}
