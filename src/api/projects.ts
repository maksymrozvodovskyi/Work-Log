import axios from "axios";
import type {
  ProjectType,
  GetProjectsParamsType,
  PaginatedResponseType,
  CreateProjectParamsType,
  UpdateProjectParamsType,
} from "@/types/Project";
import { config } from "@/config/env";

const API_URL = `${config.apiUrl}/projects`;
const ACCESS_TOKEN = config.accessToken;

export const getProjects = async (
  params?: GetProjectsParamsType
): Promise<PaginatedResponseType<ProjectType>> => {
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

  const { data } = await axios.get<PaginatedResponseType<ProjectType>>(
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

export const createProject = async (
  params: CreateProjectParamsType
): Promise<ProjectType> => {
  const { data } = await axios.post<ProjectType>(API_URL, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return data;
};

export const updateProject = async (
  id: string,
  params: UpdateProjectParamsType
): Promise<ProjectType> => {
  const { data } = await axios.put<ProjectType>(`${API_URL}/${id}`, params, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return data;
};
