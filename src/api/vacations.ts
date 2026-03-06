import axiosInstance from "@/lib/apiClient";
import { UserStatusType } from "@/types/User";

export type SortOrder = "asc" | "desc";

export type SortBy = "name" | "role" | "createdAt";

export type GetVacationsQuery = {
  skip: number;
  take: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  search?: string;
};

export type VacationCommentPreview = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
};

export type VacationUser = {
  id: string;
  name: string;
  role: string;
  status: UserStatusType;
  createdAt: string;
  workLogs: { date: string }[];
  lastComment: VacationCommentPreview | null;
};

export type GetVacationsResponse = {
  items: VacationUser[];
  total: number;
  stats: {
    red: number;
    yellow: number;
    green: number;
    clean: number;
  };
  hasNext: boolean;
  hasPrev: boolean;
};

export const getVacations = async (params: GetVacationsQuery) => {
  const { data } = await axiosInstance.get<GetVacationsResponse>("/vacations", {
    params,
  });
  return data;
};
