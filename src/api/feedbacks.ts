import axiosInstance from "@/lib/apiClient";
import type {
  FeedbacksResponseType,
  GetFeedbacksParamsType,
  DeleteFeedbackResponseType,
  CreateFeedbackPayloadType,
  FeedbackType,
} from "@/types/Feedback";

export const getMyFeedbacks = async (
  params?: GetFeedbacksParamsType
): Promise<FeedbacksResponseType> => {
  const { data } = await axiosInstance.get<FeedbacksResponseType>("/feedbacks", {
    params: {
      skip: params?.skip,
      take: params?.take,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: params?.search,
      period: params?.period,
    },
  });

  return data;
};

export const getUserFeedbacks = async (
  userId: string,
  params?: GetFeedbacksParamsType
): Promise<FeedbacksResponseType> => {
  const { data } = await axiosInstance.get<FeedbacksResponseType>(
    `/users/${userId}/feedbacks`,
    {
      params: {
        skip: params?.skip,
        take: params?.take,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
        search: params?.search,
        period: params?.period,
      },
    }
  );

  return data;
};

export const deleteFeedback = async (feedbackId: string): Promise<DeleteFeedbackResponseType> => {
  const { data } = await axiosInstance.delete<DeleteFeedbackResponseType>(`/feedbacks/${feedbackId}`);
  return data;
};

export const createFeedback = async (
  payload: CreateFeedbackPayloadType
): Promise<FeedbackType> => {
  const { data } = await axiosInstance.post<FeedbackType>("/feedbacks", {
    ...payload,
    taggedUsers: payload.taggedUsers ?? [],
  });
  return data;
};
