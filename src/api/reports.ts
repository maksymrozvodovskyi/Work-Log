import axiosInstance from "@/lib/apiClient";
import type { PaginatedResponseType } from "@/types/Project";
import type { ApiUserType } from "@/utils/userTransformers";

export type ReportType = "missed" | "work" | "special" | "overtime";

export type ReportsCountsType = {
  missed: number;
  work: number;
  special: number;
  overtime: number;
};

export type GetReportsUsersParamsType = {
  date: string;
  name?: string;
  activityTypes?: string[];
  hoursFilter?: "<8h" | "8h" | "8h>";
  reportType?: ReportType;
  sortField?: "name" | "email" | "status" | "role" | "createdAt";
  sortOrder?: "asc" | "desc";
  skip?: number;
  take?: number;
};

export const getReportsUsers = async (
  params: GetReportsUsersParamsType,
): Promise<PaginatedResponseType<ApiUserType>> => {
  const requestParams: Record<string, unknown> = {
    date: params.date,
    skip: params.skip ?? 0,
    take: params.take ?? 20,
  };

  if (params.name) {
    requestParams.name = params.name;
  }

  if (params.activityTypes && params.activityTypes.length > 0) {
    requestParams.activityTypes = params.activityTypes.join(",");
  }

  if (params.hoursFilter) {
    requestParams.hoursFilter = params.hoursFilter;
  }

  if (params.reportType) {
    requestParams.reportType = params.reportType;
  }

  if (params.sortField) {
    requestParams.sortField = params.sortField;
  }

  if (params.sortOrder) {
    requestParams.sortOrder = params.sortOrder;
  }

  const { data } = await axiosInstance.get<{
    data: ApiUserType[];
    total: number;
    hasMore?: boolean;
    nextSkip?: number;
  }>("/reports", {
    params: requestParams,
  });

  return data;
};

export const getReportsCounts = async (
  date: string,
): Promise<ReportsCountsType> => {
  const { data } = await axiosInstance.get<ReportsCountsType>(
    "/reports/counts",
    {
      params: { date },
    },
  );
  return data;
};

export const getReportsCountsForRange = async (
  startDate: string,
  endDate: string,
): Promise<Record<string, ReportsCountsType>> => {
  const { data } = await axiosInstance.get<Record<string, ReportsCountsType>>(
    "/reports/counts",
    {
      params: { startDate, endDate },
    },
  );
  return data;
};
