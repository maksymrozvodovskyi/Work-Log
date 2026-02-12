import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryState, useQueryStates } from "nuqs";
import { parseAsFeedbackPeriod } from "@/utils/parsers";
import { getCurrentSortType } from "@/utils/feedbackSortUtils";
import { useAuthStore } from "@/stores/authStore";
import { getMyFeedbacks } from "@/api/feedbacks";
import { FEEDBACK_QUERY_KEYS } from "@/features/feedbacks/queryKeys";
import { FEEDBACK_CONFIG } from "@/config/feedbacks";
import { useFeedbackState } from "@/hooks/useFeedbackState";
import { useFeedbackFilters } from "@/hooks/useFeedbackFilters";
import { useDebounce } from "@/hooks/useDebounce";
import FeedbacksHeader from "./components/FeedbacksHeader";
import FeedbacksFilters, {
  type FeedbackSortOption,
} from "./components/FeedbacksFilters";
import FeedbacksContent from "./components/FeedbacksContent";
import CreateFeedbackModal from "@/features/feedbacks/components/CreateFeedbackModal";
import css from "@/features/feedbacks/index.module.css";

export default function FeedbacksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user: currentUser } = useAuthStore();

  const {
    view,
    isSortDropdownOpen,
    setView,
    toggleSortDropdown,
    closeSortDropdown,
  } = useFeedbackState();

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

    setSortParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
  };

  const debouncedSearchTerm = useDebounce(search, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.feedbacks(
      view,
      0,
      FEEDBACK_CONFIG.TAKE,
      sortBy,
      sortOrder,
      debouncedSearchTerm,
      period,
    ),
    queryFn: () =>
      getMyFeedbacks({
        skip: 0,
        take: FEEDBACK_CONFIG.TAKE,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: debouncedSearchTerm,
        period: period,
      }),
  });

  const { createdByMe, createdForMe } = useFeedbackFilters({
    feedbacks: data?.data ?? [],
    currentUserId: currentUser?.id,
  });

  const handleAddFeedback = () => setIsCreateModalOpen(true);

  return (
    <div className={css.pageContainer}>
      <FeedbacksHeader view={view} onViewChange={setView} />

      <FeedbacksFilters
        search={search}
        sort={getCurrentSortType(period, sortOrder)}
        isSortDropdownOpen={isSortDropdownOpen}
        onSearchChange={setSearch}
        onSortChange={handleSortChange}
        onToggleSortDropdown={toggleSortDropdown}
        onCloseSortDropdown={closeSortDropdown}
        onAddFeedback={handleAddFeedback}
      />

      <div className={css.contentWrapper}>
        <FeedbacksContent
          isLoading={isLoading}
          isError={isError}
          error={error}
          createdByMe={createdByMe}
          createdForMe={createdForMe}
        />
      </div>

      <CreateFeedbackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
