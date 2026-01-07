import axios from "axios";
import type {
  Project,
  GetProjectsParams,
  PaginatedResponse,
} from "../../types/project";
import { config } from "../../config/env";

const API_URL = `${config.apiUrl}/projects`;
const ACCESS_TOKEN = config.accessToken;

export const getProjects = async (
  params?: GetProjectsParams
): Promise<PaginatedResponse<Project>> => {
  const { data } = await axios.get<PaginatedResponse<Project>>(API_URL, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    params: {
      search: params?.search,
      sortField: params?.sortField,
      sortDirection: params?.sortDirection,
      skip: params?.skip ?? 0,
      take: params?.take ?? 20,
    },
  });

  return data;
};
