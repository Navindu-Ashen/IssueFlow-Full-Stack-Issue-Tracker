import { useEffect } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useAnalyticsStore } from "@/stores/analyticsStore";
import { useIssueStore } from "@/stores/issueStore";

export default function DashboardPage() {
  const fetchAnalytics = useAnalyticsStore((s) => s.fetchAnalytics);
  const fetchIssues = useIssueStore((s) => s.fetchIssues);

  useEffect(() => {
    fetchAnalytics();
    fetchIssues({ page: 1, limit: 10 });
  }, [fetchAnalytics, fetchIssues]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable />
      </div>
    </div>
  );
}
