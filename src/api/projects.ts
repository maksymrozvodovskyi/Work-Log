import axiosInstance from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import type {
  ProjectType,
  GetProjectsParamsType,
  PaginatedResponseType,
  CreateProjectParamsType,
  UpdateProjectParamsType,
} from "@/types/Project";

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

  const token = useAuthStore.getState().accessToken;
  const { data } = await axiosInstance.get<PaginatedResponseType<ProjectType>>(
    "/projects",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: requestParams,
    }
  );

  return data;
};

export const createProject = async (
  params: CreateProjectParamsType
): Promise<ProjectType> => {
  const token = useAuthStore.getState().accessToken;
  const { data } = await axiosInstance.post<ProjectType>("/projects", params, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateProject = async (
  id: string,
  params: UpdateProjectParamsType
): Promise<ProjectType> => {
  const token = useAuthStore.getState().accessToken;
  const { data } = await axiosInstance.put<ProjectType>(
    `/projects/${id}`,
    params,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return data;
};
