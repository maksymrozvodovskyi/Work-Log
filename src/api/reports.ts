import axiosInstance from "@/lib/apiClient";
import type {
  GetReportsParamsType,
  ReportsResponseType,
} from "@/types/Report.ts";

export const getReports = async (
  params: GetReportsParamsType,
): Promise<ReportsResponseType> => {
  const requestParams: Record<string, unknown> = {
    date: params.date,
    skip: params.skip,
    take: params.take,
    sortField: params.sortField ?? "name",
    sortDirection: params.sortDirection ?? "asc",
  };

  if (params.activity && params.activity.length > 0) {
    requestParams.activity = params.activity.join(",");
  }

  if (params.hours && params.hours.length > 0) {
    requestParams.hours = params.hours.join(",");
  }

  if (params.name) {
    requestParams.name = params.name;
  }

  const { data } = await axiosInstance.get<ReportsResponseType>("/reports", {
    params: requestParams,
  });

  return data;
};
