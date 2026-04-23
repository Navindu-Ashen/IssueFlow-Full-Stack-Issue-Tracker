import { apiClient } from "@/lib/api";
import type { ActivitiesResponse } from "@/types";

export type GetActivitiesParams = {
  page?: number;
  limit?: number;
};

function buildQuery(params: GetActivitiesParams): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export async function getActivities(
  params: GetActivitiesParams = {},
): Promise<ActivitiesResponse> {
  return apiClient<ActivitiesResponse>(`/v1/api/activities${buildQuery(params)}`);
}
