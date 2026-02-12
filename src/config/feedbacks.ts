export const FEEDBACK_CONFIG = {
  TAKE: 50,
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

export const FEEDBACK_VIEW_TYPES = {
  MY: "my",
  ALL: "all",
} as const;

export const FEEDBACK_SORT_TYPES = {
  NEW: "New",
  OLD: "Old",
  LAST_7: "Last 7",
  LAST_30: "Last 30",
} as const;

export type FeedbackViewType = "my" | "all";
export type FeedbackSortType = "New" | "Old" | "Last 7" | "Last 30";
