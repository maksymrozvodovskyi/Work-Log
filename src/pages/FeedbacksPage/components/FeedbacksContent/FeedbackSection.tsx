import FeedbackCard from "@/features/feedbacks/components/FeedbackCard";
import type { FeedbackType } from "@/types/Feedback";
import css from "@/features/feedbacks/index.module.css";

type FeedbackSectionProps = {
  title: string;
  feedbacks: FeedbackType[];
  variant: "createdByMe" | "createdForMe";
  onDeleteError: (error: unknown) => void;
  hideActions?: boolean;
  profileMode?: boolean;
};

export default function FeedbackSection({
  title,
  feedbacks,
  variant,
  onDeleteError,
  hideActions = false,
  profileMode = false,
}: FeedbackSectionProps) {
  return (
    <section className={css.feedbackSection}>
      {title && <h2 className={css.feedbackSectionTitle}>{title}</h2>}
      <div className={css.feedbackCardsGrid}>
        {feedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            variant={variant}
            onDeleteError={onDeleteError}
            hideActions={hideActions}
            profileMode={profileMode}
          />
        ))}
      </div>
    </section>
  );
}
