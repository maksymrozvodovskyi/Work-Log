import type { UserRoleType } from "./Project";

export type UserStatusType = "RED" | "YELLOW" | "GREEN" | "CLEAN" | "ARCHIVED";

export type UserRangeType = {
  id: string;
  name: string;
  email: string;
  mainProject: string | null;
  otherProjects: string[];
  status: UserStatusType;
  userType?: UserRoleType;
  createdAt?: string;
  updatedAt?: string;
};

export type UserSortFieldType = "name" | "status";
export type SortDirectionType = "asc" | "desc";

export type GetUsersParamsType = {
  name?: string;
  status?: UserStatusType;
  userType?: UserRoleType;
  project?: string;
  skip?: number;
  take?: number;
  sortOrder?: "asc" | "desc";
};

export type PaginatedResponseType<T> = {
  data: T[];
  total: number;
};

export type CreateUserParamsType = {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
  status?: UserStatusType;
  mainProject?: string;
  otherProjects?: string[];
};

export type UpdateUserParamsType = {
  name?: string;
  email?: string;
  status?: UserStatusType;
  mainProject?: string;
  otherProjects?: string[];
  userType?: UserRoleType;
};
