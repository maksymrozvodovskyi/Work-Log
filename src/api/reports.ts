import axiosInstance from "@/lib/apiClient";
import type {
  GetReportsParamsType,
  ReportsResponseType,
} from "@/types/Report.ts";

export type GetCalendarDayReportsParams = {
  date: string;
  tab: "MISSED" | "PROJECT" | "SPECIAL" | "OVERTIME";
  search?: string;
  skip?: number;
  take?: number;
};

const TAB_FILTERS: Record<
  GetCalendarDayReportsParams["tab"],
  Partial<GetReportsParamsType>
> = {
  MISSED: { onlyWithoutReport: true },
  PROJECT: { activity: ["CODING", "REVIEW"] },
  SPECIAL: { activity: ["STUDING", "SICKLEAVE", "VACATION"] },
  OVERTIME: { hours: ["GT_8"] },
};

type QueryValue = string | number | boolean | undefined;

export const getReports = async (
  params: GetReportsParamsType,
): Promise<ReportsResponseType> => {
  const requestParams: Record<string, QueryValue> = {
    skip: params.skip ?? 0,
    take: params.take ?? 20,
    sortField: params.sortField ?? "name",
    sortDirection: params.sortDirection ?? "asc",
    date: params.date,
    startDate: params.startDate,
    endDate: params.endDate,
    name: params.name,
    onlyWithoutReport: params.onlyWithoutReport ? true : undefined,
    activity: params.activity?.length ? params.activity.join(",") : undefined,
    hours: params.hours?.length ? params.hours.join(",") : undefined,
  };

  const { data } = await axiosInstance.get<ReportsResponseType>("/reports", {
    params: requestParams,
  });

  return data;
};

export const getCalendarDayReports = async (
  params: GetCalendarDayReportsParams,
): Promise<ReportsResponseType> => {
  const { date, tab, search, skip = 0, take = 10 } = params;

  const base = TAB_FILTERS[tab];

  return getReports({
    date,
    ...base,
    ...(search && { name: search }),
    skip,
    take,
  });
};
