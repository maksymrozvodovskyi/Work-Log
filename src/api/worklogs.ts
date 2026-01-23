import axiosInstance from "@/lib/apiClient";
import type { WorkLogsByTimeResponseType } from "@/types/WorkLog";

export const getWorkLogsByTime = async (
  userId: string,
  startDate?: string,
  endDate?: string,
  sortOrder: "asc" | "desc" = "asc",
  types?: string[]
): Promise<WorkLogsByTimeResponseType> => {
  const params: Record<string, unknown> = {
    sortOrder,
  };

  if (startDate) {
    params.startDate = startDate;
  }

  if (endDate) {
    params.endDate = endDate;
  }

  if (types && types.length > 0) {
    params.type = types;
  }

  const { data } = await axiosInstance.get<WorkLogsByTimeResponseType>(
    `/work-logs/${userId}`,
    {
      params,
    }
  );

  return data;
};

