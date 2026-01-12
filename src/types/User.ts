import type { UserType } from "./Project";

export type UserStatus = "RED" | "YELLOW" | "GREEN" | "CLEAN" | "ARCHIVED";

export type Manager = {
  name: string;
  date: string;
};

export type UserRange = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  managers: Manager[];
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
  search?: string;
  status?: UserStatus;
  userType?: UserType;
  project?: string;
  skip?: number;
  take?: number;
  sortField?: UserSortField;
  sortDirection?: SortDirection;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

export type CreateUserParams = {
  name: string;
  email: string;
  status: UserStatus;
  mainProject?: string;
  otherProjects?: string[];
  userType?: UserType;
  avatar?: string;
};

export type UpdateUserParams = {
  name?: string;
  email?: string;
  status?: UserStatus;
  mainProject?: string;
  otherProjects?: string[];
  userType?: UserType;
  avatar?: string;
};
