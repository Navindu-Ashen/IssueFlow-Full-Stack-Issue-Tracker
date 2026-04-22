import { apiClient } from "@/lib/api";
import type { AnalyticsResponse } from "@/types";

export async function getAnalytics(): Promise<AnalyticsResponse> {
  return apiClient<AnalyticsResponse>("/v1/api/analytics");
}
