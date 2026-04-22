export type User = {
  _id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High";
export type IssueSeverity = "Minor" | "Major" | "Critical";

export type Issue = {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  createdBy: User | string;
  assignee: User | string | null;
  createdAt: string;
  updatedAt: string;
};

export type IssuesResponse = {
  issues: Issue[];
  page: number;
  totalPages: number;
  totalCount: number;
};

export type DailyIssueCount = {
  date: string;
  count: number;
};

export type IssueStatusCounts = {
  open: number;
  inProgress: number;
  resolved: number;
  totalAvailable: number;
};

export type IssuesCreatedLast7Days = {
  total: number;
  daily: DailyIssueCount[];
};

export type AnalyticsResponse = {
  issuesCreatedLast7Days: IssuesCreatedLast7Days;
  issueStatusCounts: IssueStatusCounts;
};
