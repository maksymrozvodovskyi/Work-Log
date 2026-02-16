export const FEEDBACK_MUTATION_KEYS = {
  delete: ["feedbacks", "delete"] as const,
};

export const FEEDBACK_QUERY_KEYS = {
  base: "feedbacks",
  feedbacks: (
    view: "my" | "all",
    skip?: number,
    take?: number,
    sortBy?: "createdAt" | null,
    sortOrder?: "asc" | "desc" | null,
    search?: string | null,
    period?: "7days" | "30days" | null
  ) =>
    ["feedbacks", view, skip, take, sortBy, sortOrder, search, period] as const,
  userFeedbacks: (
    userId: string,
    skip?: number,
    take?: number,
    sortBy?: "createdAt" | null,
    sortOrder?: "asc" | "desc" | null,
    search?: string | null,
    period?: "7days" | "30days" | null
  ) =>
    [
      "feedbacks",
      "user",
      userId,
      skip,
      take,
      sortBy,
      sortOrder,
      search,
      period,
    ] as const,
};
