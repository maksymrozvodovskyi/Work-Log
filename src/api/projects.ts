import axiosInstance from "@/lib/apiClient";
import type {
  ProjectType,
  GetProjectsParamsType,
  ProjectsResponseType,
  CreateProjectParamsType,
  UpdateProjectParamsType,
} from "@/types/Project";

export const getProjects = async (
  params?: GetProjectsParamsType
): Promise<ProjectsResponseType> => {
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

  const { data } = await axiosInstance.get<ProjectsResponseType>(
    "/projects",
    {
      params: requestParams,
    }
  );

  return data;
};

export const createProject = async (
  params: CreateProjectParamsType
): Promise<ProjectType> => {
  const { data } = await axiosInstance.post<ProjectType>("/projects", params);

  return data;
};

export const updateProject = async (
  id: string,
  params: UpdateProjectParamsType
): Promise<ProjectType> => {
  const { data } = await axiosInstance.put<ProjectType>(
    `/projects/${id}`,
    params
  );

  return data;
};

export const addUserToProject = async (
  projectId: string,
  userId: string
): Promise<ProjectType> => {
  const { data } = await axiosInstance.post<ProjectType>(
    `/projects/${projectId}/users`,
    { userId }
  );

  return data;
};