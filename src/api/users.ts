import axiosInstance from "@/lib/apiClient";
import type {
  GetUsersParamsType,
  CreateUserParamsType,
  UpdateUserParamsType,
} from "@/types/User";
import type { PaginatedResponseType } from "@/types/Project";
import type { ProjectStatusType } from "@/types/Project";
import type { ApiUserType, ApiProjectType } from "@/utils/userTransformers";

export type GetUserProjectsParamsType = {
  search?: string;
  status?: ProjectStatusType;
  sortField?: "name" | "status";
  sortDirection?: "asc" | "desc";
  skip?: number;
  take?: number;
};

export const getUsers = async (
  params?: GetUsersParamsType
): Promise<PaginatedResponseType<ApiUserType>> => {
  const requestParams: Record<string, unknown> = {
    skip: params?.skip,
    take: params?.take,
  };

  if (params?.name) {
    requestParams.name = params.name;
  }

  if (params?.status) {
    requestParams.status = params.status;
  }

  if (params?.userType) {
    requestParams.userType = params.userType;
  }

  if (params?.project) {
    requestParams.project = params.project;
  }

  if (params?.sortField) {
    requestParams.sortField = params.sortField;
  }

  if (params?.sortOrder) {
    requestParams.sortOrder = params.sortOrder;
  }

  const { data } = await axiosInstance.get<{ data: ApiUserType[]; total: number }>(
    "/users",
    {
      params: requestParams,
    }
  );

  return data;
};

export const createUser = async (
  params: CreateUserParamsType
): Promise<ApiUserType> => {
  const { data } = await axiosInstance.post<ApiUserType>("/users", params);

  return data;
};

export const getUserById = async (id: string): Promise<ApiUserType> => {
  const { data } = await axiosInstance.get<ApiUserType>(`/users/${id}/profile`);

  return data;
};

export const updateUser = async (
  id: string,
  params: UpdateUserParamsType
): Promise<ApiUserType> => {
  const { data } = await axiosInstance.put<ApiUserType>(`/users/${id}`, params);

  return data;
};


export const getUserProjects = async (
  userId: string,
  params?: GetUserProjectsParamsType
): Promise<PaginatedResponseType<ApiProjectType>> => {
  const requestParams: Record<string, unknown> = {};

  if (params?.search) {
    requestParams.search = params.search;
  }

  if (params?.status) {
    requestParams.status = params.status;
  }

  if (params?.sortField) {
    requestParams.sortField = params.sortField;
  }

  if (params?.sortDirection) {
    requestParams.sortDirection = params.sortDirection;
  }

  if (params?.skip !== undefined) {
    requestParams.skip = params.skip;
  }

  if (params?.take !== undefined) {
    requestParams.take = params.take;
  }

  const { data } = await axiosInstance.get<PaginatedResponseType<ApiProjectType>>(
    `/projects/user/${userId}`,
    {
      params: requestParams,
    }
  );

  return data;
};