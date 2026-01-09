import axios from "axios";
import type {
  Project,
  GetProjectsParams,
  PaginatedResponse,
  CreateProjectParams,
  UpdateProjectParams,
} from "../types/Project";
import { config } from "../config/env";

const API_URL = `${config.apiUrl}/projects`;
const ACCESS_TOKEN = config.accessToken;

export const getProjects = async (
  params?: GetProjectsParams
): Promise<PaginatedResponse<Project>> => {
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

  const { data } = await axios.get<PaginatedResponse<Project>>(API_URL, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    params: requestParams,
  });

  return data;
};

export const createProject = async (
  params: CreateProjectParams
): Promise<Project> => {
  const { data } = await axios.post<Project>(API_URL, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return data;
};

export const updateProject = async (
  id: string,
  params: UpdateProjectParams
): Promise<Project> => {
  const { data } = await axios.put<Project>(`${API_URL}/${id}`, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return data;
};
