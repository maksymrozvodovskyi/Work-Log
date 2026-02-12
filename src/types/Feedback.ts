export type FeedbackType = {
  id: string;
  authorId: string;
  targetUserId: string;
  content: string;
  taggedUsersDetails: { id: string; name: string }[];
  createdAt: string;
  author: { id: string; name: string; email: string };
  targetUser: { id: string; name: string; email: string };
};

export type FeedbacksResponseType = {
  data: FeedbackType[];
  total: number;
  hasMore?: boolean;
  nextSkip?: number;
};

export type GetFeedbacksParamsType = {
  skip?: number;
  take?: number;
  sortBy?: "createdAt" | null;
  sortOrder?: "asc" | "desc" | null;
  search?: string | null;
  period?: "7days" | "30days" | null;
};

export type DeleteFeedbackResponseType = {
  success: boolean;
  message: string;
};

export type CreateFeedbackPayloadType = {
  targetUserId: string;
  content: string;
  taggedUsers?: string[];
};
