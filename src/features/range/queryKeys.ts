export const USER_QUERY_KEYS = {
  users: "users",
  userProjects: (
    userId: string | undefined,
    search?: string,
    sortField?: string,
    sortDirection?: string
  ) => ["userProjects", userId, search, sortField, sortDirection] as const,
};

