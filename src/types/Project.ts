export type UserRoleType = "ADMIN" | "EMPLOYEE";

export const USER_TYPES: UserRoleType[] = ["ADMIN", "EMPLOYEE"];

export type UserType = {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
};

export type ProjectStatusType =
  | "PLANNED"
  | "INPROGRESS"
  | "ONHOLD"
  | "COMPLETED"
  | "CANCELLED"
  | "SUPPORT";

export type ProjectType = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatusType;
  createdAt: string;
  updatedAt: string;
  users: UserType[];
};

export type SortFieldType = "name" | "status";
export type SortDirectionType = "asc" | "desc";

export type GetProjectsParamsType = {
  search?: string;
  sortField?: SortFieldType;
  sortDirection?: SortDirectionType;
  skip?: number;
  take?: number;
  status?: ProjectStatusType;
};

export type PaginatedResponseType<T> = {
  data: T[];
  total: number;
};

export type CreateProjectParamsType = {
  name: string;
  description?: string;
  status: ProjectStatusType;
};

export type UpdateProjectParamsType = {
  name?: string;
  description?: string;
  status?: ProjectStatusType;
};
