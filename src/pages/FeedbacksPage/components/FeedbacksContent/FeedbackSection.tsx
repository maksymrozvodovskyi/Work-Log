import FeedbackCard from "@/features/feedbacks/components/FeedbackCard";
import type { FeedbackType } from "@/types/Feedback";
import css from "@/features/feedbacks/index.module.css";

type FeedbackSectionProps = {
  title: string;
  feedbacks: FeedbackType[];
  variant: "createdByMe" | "createdForMe";
  onDeleteError: (error: unknown) => void;
};

export default function FeedbackSection({
  title,
  feedbacks,
  variant,
  onDeleteError,
}: FeedbackSectionProps) {
  return (
    <section className={css.feedbackSection}>
      <h2 className={css.feedbackSectionTitle}>{title}</h2>
      <div className={css.feedbackCardsGrid}>
        {feedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            variant={variant}
            onDeleteError={onDeleteError}
          />
        ))}
      </div>
    </section>
  );
}
