import { useMemo } from "react";
import type { FeedbackType } from "@/types/Feedback";

interface UseFeedbackFiltersProps {
  feedbacks: FeedbackType[];
  currentUserId?: string;
  profileUserId?: string;
}

interface FilteredFeedbacks {
  createdByMe: FeedbackType[];
  createdForMe: FeedbackType[];
}

export const useFeedbackFilters = ({
  feedbacks,
  currentUserId,
  profileUserId,
}: UseFeedbackFiltersProps): FilteredFeedbacks => {
  const userId = profileUserId ?? currentUserId;

  return useMemo(() => {
    const createdByMe = feedbacks.filter(
      (feedback) => feedback.authorId === userId,
    );
    const createdForMe = feedbacks.filter(
      (feedback) => feedback.targetUserId === userId,
    );

    return { createdByMe, createdForMe };
  }, [feedbacks, userId]);
};
