import axiosInstance from "@/lib/apiClient";

export type CreateVacationCommentBody = {
  content: string;
};

export type VacationComment = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
};

export type GetVacationCommentsQuery = {
  userId: string;
  take?: number;
  skip?: number;
};

export type GetVacationCommentsResponse = {
  items: VacationComment[];
  hasNext: boolean;
  nextSkip: number;
  total: number;
};

export const getVacationComments = async ({
  userId,
  take = 5,
  skip = 0,
}: GetVacationCommentsQuery) => {
  const { data } = await axiosInstance.get<GetVacationCommentsResponse>(
    `/vacations/${userId}/comments`,
    { params: { take, skip } },
  );
  return data;
};

export const createVacationComment = async (
  userId: string,
  body: CreateVacationCommentBody,
) => {
  const { data } = await axiosInstance.post<VacationComment>(
    `/vacations/${userId}/comments`,
    body,
  );
  return data;
};
