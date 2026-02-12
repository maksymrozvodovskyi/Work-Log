import { useQueryState, useQueryStates } from "nuqs";
import { parseAsFeedbackPeriod } from "@/utils/parsers";
import {
  getCurrentSortType,
  type FeedbackSortOption,
} from "@/utils/feedbackSortUtils";

export type { FeedbackSortOption };

export const useFeedbackQueryParams = () => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  const [{ sortBy, sortOrder }, setSortParams] = useQueryStates({
    sortBy: {
      defaultValue: "createdAt",
      parse: (value: string | null): "createdAt" => {
        return value === "createdAt" ? "createdAt" : "createdAt";
      },
    },
    sortOrder: {
      defaultValue: "desc",
      parse: (value: string | null): "asc" | "desc" => {
        return value === "asc" ? "asc" : "desc";
      },
    },
  });

  const [period, setPeriod] = useQueryState("period", parseAsFeedbackPeriod);

  const handleSortChange = (newSortType: FeedbackSortOption) => {
    if (newSortType === "Last 7 days") {
      setPeriod("7days");
      return;
    }
    if (newSortType === "Last 30 days") {
      setPeriod("30days");
      return;
    }
    setPeriod(null);
    const newSortBy = "createdAt";
    const newSortOrder = newSortType === "New" ? "desc" : "asc";
    setSortParams({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const currentSortType = getCurrentSortType(period, sortOrder);

  return {
    search,
    setSearch,
    sortBy,
    sortOrder,
    period,
    currentSortType,
    handleSortChange,
  };
};
