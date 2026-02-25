import type { StatusInfoType } from "./StatusInfo";

export type ActivityType =
  | "CODING"
  | "REVIEW"
  | "STUDING"
  | "SICKLEAVE"
  | "VACATION"
  | "WITHOUT_REPORT";

export type HoursFilterType = "LT_8" | "EQ_8" | "GT_8";

export type ReportItemType = {
  userId: string;
  name: string;
  status: ActivityType;
  projects: string[];
  totalMinutes: number;
  total: string;
};

export type ReportsResponseType = {
  reports: ReportItemType[];
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type ReportSortFieldType = "name" | "status" | "totalMinutes";

export type GetReportsParamsType = {
  date: string;
  activity?: ActivityType[];
  hours?: HoursFilterType[];
  skip?: number;
  take?: number;
  sortField?: ReportSortFieldType;
  sortDirection?: "asc" | "desc";
  name?: string;
};

export const activityStatusMap: Record<ActivityType, StatusInfoType> = {
  CODING: { label: "Coding", color: "#22c55e" },
  REVIEW: { label: "Review", color: "#3b82f6" },
  STUDING: { label: "Studying", color: "#8b5cf6" },
  SICKLEAVE: { label: "Sick leave", color: "#ef4444" },
  VACATION: { label: "Vacations", color: "#ef4444" },
  WITHOUT_REPORT: { label: "Without report", color: "#94a3b8" },
};
