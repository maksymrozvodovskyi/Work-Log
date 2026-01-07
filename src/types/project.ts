export type User = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EMPLOYEE";
};

export type ProjectStatus = "INPROGRESS" | "COMPLETED" | "PENDING";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  users: User[];
};

export type SortField = "status" | "name";
export type SortDirection = "asc" | "desc";

export type GetProjectsParams = {
  search?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
  skip?: number;
  take?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};
