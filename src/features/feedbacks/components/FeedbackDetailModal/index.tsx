import { createPortal } from "react-dom";
import { useModal } from "@/hooks/useModal";
import { formatFeedbackDate } from "@/utils/dateFormatters";
import type { FeedbackType } from "@/types/Feedback";
import css from "./FeedbackDetailModal.module.css";

type FeedbackDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackType | null;
};

export default function FeedbackDetailModal({
  isOpen,
  onClose,
  feedback,
}: FeedbackDetailModalProps) {
  const { modalRef } = useModal<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const formattedDate = feedback?.createdAt
    ? formatFeedbackDate(feedback.createdAt)
    : "";

  const receivers = feedback?.taggedUsersDetails ?? [];

  const modalContent = (
    <>
      <div className={css.overlay} style={{ zIndex: 1499 }} />
      <div ref={modalRef} className={css.modal}>
        <div className={css.header}>
          <h2 className={css.title}>Feedback</h2>
          {formattedDate && <span className={css.date}>{formattedDate}</span>}
        </div>
        <div className={css.content}>
          <div className={`${css.field} ${css.fieldWithName}`}>
            <span className={css.label}>From:</span>
            <div className={css.tags}>
              <span className={css.tag}>
                {feedback?.author?.name ?? "Anonymous"}
              </span>
            </div>
          </div>
          <div className={`${css.field} ${css.fieldWithName}`}>
            <span className={css.label}>Assignee:</span>
            <div className={css.tags}>
              <span className={css.tag}>
                {feedback?.targetUser?.name ?? "Anonymous"}
              </span>
            </div>
          </div>
          <div className={`${css.field} ${css.fieldFeedback}`}>
            <div className={css.feedbackContent}>
              {feedback?.content ?? "No content"}
            </div>
          </div>
          <div className={css.field}>
            <span className={css.label}>Receivers:</span>
            <div className={css.receiversTags}>
              {receivers.length > 0 ? (
                receivers.map((user) => (
                  <span key={user.id} className={css.receiverTag}>
                    {user.name}
                  </span>
                ))
              ) : (
                <span className={css.receiverTag}>—</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
