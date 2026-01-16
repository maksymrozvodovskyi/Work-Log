import axiosInstance from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import type {
  GetUsersParamsType,
  PaginatedResponseType,
  CreateUserParamsType,
  UpdateUserParamsType,
} from "@/types/User";
import type { ApiUserType } from "@/utils/userTransformers";

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

  if (params?.sortOrder) {
    requestParams.sortOrder = params.sortOrder;
  }

  const token = useAuthStore.getState().accessToken;
  const { data } = await axiosInstance.get<PaginatedResponseType<ApiUserType>>(
    "/users",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: requestParams,
    }
  );

  return data;
};

export const createUser = async (
  params: CreateUserParamsType
): Promise<ApiUserType> => {
  const token = useAuthStore.getState().accessToken;
  const { data } = await axiosInstance.post<ApiUserType>("/users", params, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateUser = async (
  id: string,
  params: UpdateUserParamsType
): Promise<ApiUserType> => {
  const token = useAuthStore.getState().accessToken;
  const { data } = await axiosInstance.put<ApiUserType>(
    `/users/${id}`,
    params,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return data;
};
