export type FeedbackSortOption =
  | "New"
  | "Old"
  | "Last 7 days"
  | "Last 30 days";

export const getCurrentSortType = (
  period: "7days" | "30days" | null,
  sortOrder: "asc" | "desc" | null
): FeedbackSortOption => {
  if (period === "7days") return "Last 7 days";
  if (period === "30days") return "Last 30 days";
  return sortOrder === "desc" ? "New" : "Old";
};