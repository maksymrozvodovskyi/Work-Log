import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getMyFeedbacks, getUserFeedbacks } from "@/api/feedbacks";
import { FEEDBACK_QUERY_KEYS } from "@/features/feedbacks/queryKeys";
import { FEEDBACK_CONFIG } from "@/config/feedbacks";
import { useFeedbackFilters } from "@/hooks/useFeedbackFilters";
import { useFeedbackQueryParams } from "@/hooks/useFeedbackQueryParams";
import { useDebounce } from "@/hooks/useDebounce";
import clsx from "clsx";
import FeedbacksFilters from "@/pages/FeedbacksPage/components/FeedbacksFilters";
import FeedbacksContent from "@/pages/FeedbacksPage/components/FeedbacksContent";
import css from "@/features/feedbacks/index.module.css";

export default function FeedbacksTab() {
  const { id: userId } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();

  const { search, sortBy, sortOrder, period } = useFeedbackQueryParams();
  const debouncedSearchTerm = useDebounce(search, 500);

  const isOwnProfile = userId === currentUser?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: isOwnProfile
      ? FEEDBACK_QUERY_KEYS.feedbacks(
          "my",
          0,
          FEEDBACK_CONFIG.TAKE,
          sortBy,
          sortOrder,
          debouncedSearchTerm,
          period,
        )
      : FEEDBACK_QUERY_KEYS.userFeedbacks(
          userId!,
          0,
          FEEDBACK_CONFIG.TAKE,
          sortBy,
          sortOrder,
          debouncedSearchTerm,
          period,
        ),
    queryFn: () =>
      isOwnProfile
        ? getMyFeedbacks({
            skip: 0,
            take: FEEDBACK_CONFIG.TAKE,
            sortBy,
            sortOrder,
            search: debouncedSearchTerm,
            period,
          })
        : getUserFeedbacks(userId!, {
            skip: 0,
            take: FEEDBACK_CONFIG.TAKE,
            sortBy,
            sortOrder,
            search: debouncedSearchTerm,
            period,
          }),
    enabled: !!userId,
  });

  const { createdForMe } = useFeedbackFilters({
    feedbacks: data?.data ?? [],
    profileUserId: userId,
  });

  return (
    <div className={clsx(css.pageContainer, css.profileFeedbacksLayout)}>
      <FeedbacksFilters hideDivider />

      <div className={css.contentWrapper}>
        <FeedbacksContent
          isLoading={isLoading}
          isError={isError}
          error={error}
          createdByMe={[]}
          createdForMe={createdForMe}
          profileMode
        />
      </div>
    </div>
  );
}
