import type { UserType } from "./Project";

export type UserStatus = "RED" | "YELLOW" | "GREEN" | "CLEAN" | "ARCHIVED";

export type UserRange = {
  id: string;
  name: string;
  email: string;
  mainProject: string | null;
  otherProjects: string[];
  status: UserStatus;
  userType?: UserType;
  createdAt?: string;
  updatedAt?: string;
};

export type UserSortField = "name" | "status";
export type SortDirection = "asc" | "desc";

export type GetUsersParams = {
  name?: string;
  status?: UserStatus;
  userType?: UserType;
  project?: string;
  skip?: number;
  take?: number;
  sortOrder?: "asc" | "desc";
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
  role: UserType;
  status?: UserStatus;
  mainProject?: string;
  otherProjects?: string[];
};

export type UpdateUserParams = {
  name?: string;
  email?: string;
  status?: UserStatus;
  mainProject?: string;
  otherProjects?: string[];
  userType?: UserType;
};
