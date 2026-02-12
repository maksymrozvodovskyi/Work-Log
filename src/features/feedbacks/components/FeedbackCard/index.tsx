import { useState } from "react";
import { formatFeedbackDate } from "@/utils/dateFormatters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ThreeDotsIcon from "@/components/svg/ThreeDotsIcon";
import { useClickOutside } from "@/hooks/useClickOutside";
import { deleteFeedback } from "@/api/feedbacks";
import { FEEDBACK_MUTATION_KEYS, FEEDBACK_QUERY_KEYS } from "../../queryKeys";
import FeedbackDetailModal from "../FeedbackDetailModal";
import type { FeedbackType } from "@/types/Feedback";
import css from "../../index.module.css";

type FeedbackCardVariantType = "createdByMe" | "createdForMe";

type FeedbackCardPropsType = {
  feedback: FeedbackType;
  variant: FeedbackCardVariantType;
  onDeleteError?: (error: unknown) => void;
};

const FeedbackCard = ({
  feedback,
  variant,
  onDeleteError,
}: FeedbackCardPropsType) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: FEEDBACK_MUTATION_KEYS.delete,
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDBACK_QUERY_KEYS.base] });
      setIsOptionsOpen(false);
    },
    onError: (error) => {
      setIsOptionsOpen(false);
      onDeleteError?.(error);
    },
  });

  const optionsRef = useClickOutside<HTMLDivElement>(
    () => setIsOptionsOpen(false),
    isOptionsOpen,
  );

  const formattedDate = formatFeedbackDate(feedback.createdAt || "");

  const handleDeleteFeedback = () => {
    onDeleteError?.(undefined);
    deleteMutation.mutate(feedback.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={css.feedbackCard}
      onClick={() => setIsDetailModalOpen(true)}
      onKeyDown={(e) => e.key === "Enter" && setIsDetailModalOpen(true)}
    >
      <div className={css.feedbackHeader}>
        <div className={css.feedbackFromTo}>
          {variant === "createdByMe" && (
            <div>
              <span className={css.feedbackLabel}>to: </span>
              <span className={css.feedbackName}>
                {feedback.targetUser.name}
              </span>
            </div>
          )}
          {variant === "createdForMe" && (
            <div>
              <span className={css.feedbackLabel}>from: </span>
              <span className={css.feedbackName}>{feedback.author.name}</span>
            </div>
          )}
        </div>
        <div
          className={css.feedbackOptionsWrapper}
          ref={optionsRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            role="button"
            tabIndex={0}
            className={css.feedbackOptionsButton}
            aria-label="Feedback options"
            aria-expanded={isOptionsOpen}
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            onKeyDown={(e) =>
              e.key === "Enter" && setIsOptionsOpen(!isOptionsOpen)
            }
          >
            <ThreeDotsIcon fill="#8B97A3" />
          </div>
          {isOptionsOpen && (
            <div className={css.feedbackOptionsModal}>
              <button
                type="button"
                className={css.feedbackOptionsModalButton}
                onClick={handleDeleteFeedback}
                disabled={deleteMutation.isPending}
              >
                Delete feedback
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={css.feedbackCardBody}>
        <p className={css.feedbackContent}>{feedback.content}</p>
        <div className={css.feedbackDate}>{formattedDate}</div>
      </div>
      <FeedbackDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        feedback={feedback}
      />
    </div>
  );
};

export default FeedbackCard;
