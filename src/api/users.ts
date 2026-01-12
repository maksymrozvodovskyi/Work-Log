import axios from "axios";
import type {
  UserRange,
  UserStatus,
  GetUsersParams,
  PaginatedResponse,
  CreateUserParams,
  UpdateUserParams,
} from "@/types/User";
import type { UserType } from "@/types/Project";
import { config } from "@/config/env";

const API_URL = `${config.apiUrl}/users`;
const ACCESS_TOKEN = config.accessToken;

type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: UserType;
  createdAt: string;
};

export const getUsers = async (
  params?: GetUsersParams
): Promise<PaginatedResponse<UserRange>> => {
  const requestParams: Record<string, unknown> = {
    search: params?.search,
    sortField: params?.sortField,
    sortDirection: params?.sortDirection,
    skip: params?.skip,
    take: params?.take,
  };

  if (params?.status) {
    requestParams.status = params.status;
  }

  if (params?.userType) {
    requestParams.userType = params.userType;
  }

  if (params?.project) {
    requestParams.project = params.project;
  }

  const { data } = await axios.get<ApiUser[]>(API_URL, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    params: requestParams,
  });

  const transformedUsers: UserRange[] = data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    avatar: undefined,
    managers: [],
    mainProject: null,
    otherProjects: [],
    status: "GREEN" as UserStatus,
    userType: user.role,
  }));

  return {
    data: transformedUsers,
    total: transformedUsers.length,
  };
};

export const createUser = async (
  params: CreateUserParams
): Promise<UserRange> => {
  const { data } = await axios.post<ApiUser>(API_URL, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt,
    avatar: params.avatar,
    managers: [],
    mainProject: params.mainProject || null,
    otherProjects: params.otherProjects || [],
    status: params.status,
    userType: params.userType || data.role,
  };
};

export const updateUser = async (
  id: string,
  params: UpdateUserParams
): Promise<UserRange> => {
  const { data } = await axios.put<ApiUser>(`${API_URL}/${id}`, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt,
    avatar: params.avatar,
    managers: [],
    mainProject: params.mainProject || null,
    otherProjects: params.otherProjects || [],
    status: params.status || "GREEN",
    userType: params.userType || data.role,
  };
};
