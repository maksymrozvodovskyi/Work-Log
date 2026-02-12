import { useState } from "react";
import { useIsMutating } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import FeedbackCard from "@/features/feedbacks/components/FeedbackCard";
import { FEEDBACK_MUTATION_KEYS } from "@/features/feedbacks/queryKeys";
import { getDeleteFeedbackErrorMessage } from "@/utils/axiosError";
import type { FeedbackType } from "@/types/Feedback";
import css from "@/features/feedbacks/index.module.css";

type FeedbacksContentProps = {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createdByMe: FeedbackType[];
  createdForMe: FeedbackType[];
};

export default function FeedbacksContent({
  isLoading,
  isError,
  error,
  createdByMe,
  createdForMe,
}: FeedbacksContentProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isDeleting =
    useIsMutating({ mutationKey: FEEDBACK_MUTATION_KEYS.delete }) > 0;

  const handleDeleteError = (error: unknown) => {
    if (error == null) {
      setDeleteError(null);
      return;
    }
    const message = getDeleteFeedbackErrorMessage(error);
    setDeleteError(message);
  };

  const renderFeedbackSection = (
    title: string,
    feedbacks: FeedbackType[],
    variant: "createdByMe" | "createdForMe",
  ) => (
    <section className={css.feedbackSection}>
      <h2 className={css.feedbackSectionTitle}>{title}</h2>
      <div className={css.feedbackCardsGrid}>
        {feedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            variant={variant}
            onDeleteError={handleDeleteError}
          />
        ))}
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <div className={css.feedbackContentWrapper}>
        <div className={css.loadingState}>
          <Loader size="large" inline />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.emptyState}>
        <span className={css.emptyText}>
          {error?.message || "An error occurred while loading feedbacks"}
        </span>
      </div>
    );
  }

  if (createdByMe.length === 0 && createdForMe.length === 0) {
    return (
      <div className={css.emptyState}>
        <span className={css.emptyText}>No feedbacks yet</span>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className={css.feedbackContentWrapper}>
        <div className={css.loadingState} aria-busy aria-live="polite">
          <Loader size="large" inline />
        </div>
      </div>
    );
  }

  return (
    <div className={css.feedbackContentWrapper}>
      {deleteError && (
        <div className={css.deleteErrorBanner}>
          <span className={css.deleteErrorText}>{deleteError}</span>
          <button
            type="button"
            className={css.deleteErrorDismiss}
            onClick={() => setDeleteError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      {createdByMe.length > 0 &&
        renderFeedbackSection("Created by me", createdByMe, "createdByMe")}
      {createdForMe.length > 0 &&
        renderFeedbackSection("Created for me", createdForMe, "createdForMe")}
    </div>
  );
}
