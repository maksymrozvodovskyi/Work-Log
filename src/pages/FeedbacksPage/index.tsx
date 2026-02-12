import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getMyFeedbacks } from "@/api/feedbacks";
import { FEEDBACK_QUERY_KEYS } from "@/features/feedbacks/queryKeys";
import { FEEDBACK_CONFIG } from "@/config/feedbacks";
import { useFeedbackState } from "@/hooks/useFeedbackState";
import { useFeedbackFilters } from "@/hooks/useFeedbackFilters";
import { useFeedbackQueryParams } from "@/hooks/useFeedbackQueryParams";
import { useDebounce } from "@/hooks/useDebounce";
import FeedbacksHeader from "./components/FeedbacksHeader";
import FeedbacksFilters from "./components/FeedbacksFilters";
import FeedbacksContent from "./components/FeedbacksContent";
import CreateFeedbackModal from "@/features/feedbacks/components/CreateFeedbackModal";
import css from "@/features/feedbacks/index.module.css";

export default function FeedbacksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user: currentUser } = useAuthStore();

  const { view, setView } = useFeedbackState();

  const { search, sortBy, sortOrder, period } = useFeedbackQueryParams();

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

  return (
    <div className={css.pageContainer}>
      <FeedbacksHeader view={view} onViewChange={setView} />

      <FeedbacksFilters onAddFeedback={() => setIsCreateModalOpen(true)} />

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
