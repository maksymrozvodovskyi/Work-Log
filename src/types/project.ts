export type UserType = "ADMIN" | "EMPLOYEE";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserType;
};

export type ProjectStatus =
  | "PLANNED"
  | "INPROGRESS"
  | "ONHOLD"
  | "COMPLETED"
  | "CANCELLED"
  | "SUPPORT";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  users: User[];
};

export type SortField = "name" | "status";
export type SortDirection = "asc" | "desc";

export type GetProjectsParams = {
  search?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
  skip?: number;
  take?: number;
  status?: ProjectStatus;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

export type CreateProjectParams = {
  name: string;
  description?: string;
  status: ProjectStatus;
};

export type UpdateProjectParams = {
  name?: string;
  description?: string;
  status?: ProjectStatus;
};
