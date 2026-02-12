import { useMemo } from "react";
import type { FeedbackType } from "@/types/Feedback";

interface UseFeedbackFiltersProps {
  feedbacks: FeedbackType[];
  currentUserId?: string;
}

interface FilteredFeedbacks {
  createdByMe: FeedbackType[];
  createdForMe: FeedbackType[];
}

export const useFeedbackFilters = ({
  feedbacks,
  currentUserId,
}: UseFeedbackFiltersProps): FilteredFeedbacks => {
  return useMemo(() => {
    const createdByMe = feedbacks.filter(
      (feedback) => feedback.authorId === currentUserId,
    );
    const createdForMe = feedbacks.filter(
      (feedback) => feedback.targetUserId === currentUserId,
    );

    return { createdByMe, createdForMe };
  }, [feedbacks, currentUserId]);
};
