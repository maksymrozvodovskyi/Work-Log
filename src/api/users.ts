import axios from "axios";
import type {
  GetUsersParamsType,
  PaginatedResponseType,
  CreateUserParamsType,
  UpdateUserParamsType,
} from "@/types/User";
import { config } from "@/config/env";
import type { ApiUserType } from "@/utils/userTransformers";

const API_URL = `${config.apiUrl}/users`;
const ACCESS_TOKEN = config.accessToken;

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

  const { data } = await axios.get<PaginatedResponseType<ApiUserType>>(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: requestParams,
    }
  );

  return data;
};

export const createUser = async (
  params: CreateUserParamsType
): Promise<ApiUserType> => {
  const { data } = await axios.post<ApiUserType>(API_URL, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return data;
};

export const updateUser = async (
  id: string,
  params: UpdateUserParamsType
): Promise<ApiUserType> => {
  const { data } = await axios.put<ApiUserType>(`${API_URL}/${id}`, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return data;
};
