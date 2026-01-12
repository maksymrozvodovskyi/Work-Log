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

type ApiProject = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
};

type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: UserType;
  createdAt: string;
  projects?: ApiProject[];
};

export const getUsers = async (
  params?: GetUsersParams
): Promise<PaginatedResponse<UserRange>> => {
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

  const { data } = await axios.get<PaginatedResponse<ApiUser>>(API_URL, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    params: requestParams,
  });

  const transformedUsers: UserRange[] = data.data.map((user) => {
    const projectNames = (user.projects || []).map((p) => p.name);
    const mainProject = projectNames.length > 0 ? projectNames[0] : null;
    const otherProjects = projectNames.length > 1 ? projectNames.slice(1) : [];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      mainProject,
      otherProjects,
      status: "GREEN" as UserStatus,
      userType: user.role,
    };
  });

  return {
    data: transformedUsers,
    total: data.total,
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

  const projectNames = (data.projects || []).map((p) => p.name);
  const mainProject = projectNames.length > 0 ? projectNames[0] : null;
  const otherProjects = projectNames.length > 1 ? projectNames.slice(1) : [];

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt,
    mainProject,
    otherProjects,
    status: params.status || "GREEN",
    userType: data.role,
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

  const projectNames = (data.projects || []).map((p) => p.name);
  const mainProject = projectNames.length > 0 ? projectNames[0] : null;
  const otherProjects = projectNames.length > 1 ? projectNames.slice(1) : [];

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt,
    mainProject,
    otherProjects,
    status: params.status || "GREEN",
    userType: params.userType || data.role,
  };
};
