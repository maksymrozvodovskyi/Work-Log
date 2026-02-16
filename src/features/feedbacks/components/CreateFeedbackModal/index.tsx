import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/hooks/useModal";
import { createFeedback } from "@/api/feedbacks";
import { getUserById } from "@/api/users";
import { FEEDBACK_QUERY_KEYS } from "../../queryKeys";
import { handleAxiosError } from "@/utils/axiosError";
import { useAuthStore } from "@/stores/authStore";
import UserSelectModal from "@/features/projects/components/UserSelectModal";
import UsersMultiSelectModal from "../UsersMultiSelectModal";
import type { ApiUserType } from "@/utils/userTransformers";
import Loader from "@/components/Loader";
import css from "./CreateFeedbackModal.module.css";

const MODAL_TYPES = {
  ASSIGNEE: "assignee",
  RECEIVERS: "receivers",
} as const;

type ActiveModalType = "assignee" | "receivers" | null;

type CreateFeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTargetUserId?: string;
};

export default function CreateFeedbackModal({
  isOpen,
  onClose,
  initialTargetUserId,
}: CreateFeedbackModalProps) {
  type Receiver = { id: string; name: string };

  const queryClient = useQueryClient();

  const { user: currentUser } = useAuthStore();

  const [selectedAssignee, setSelectedAssignee] = useState<ApiUserType | null>(
    null,
  );

  const [selectedReceivers, setSelectedReceivers] = useState<Receiver[]>([]);

  const [content, setContent] = useState("");

  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setSelectedAssignee(null);
    setSelectedReceivers([]);
    setContent("");
    setActiveModal(null);
    onClose();
  }, [onClose]);

  const { modalRef } = useModal<HTMLDivElement>(isOpen, handleClose, {
    isClickOutsideEnabled: isOpen && !activeModal,
  });

  useEffect(() => {
    if (isOpen && initialTargetUserId && !selectedAssignee) {
      getUserById(initialTargetUserId)
        .then((user) => setSelectedAssignee(user))
        .catch(() => {});
    }
  }, [isOpen, initialTargetUserId, selectedAssignee]);

  const handleSubmit = async () => {
    if (!selectedAssignee?.id || !content.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      await createFeedback({
        targetUserId: selectedAssignee.id,
        content: content.trim(),
        taggedUsers: selectedReceivers.map((r) => r.id),
      });

      queryClient.invalidateQueries({ queryKey: [FEEDBACK_QUERY_KEYS.base] });
      handleClose();
    } catch (err) {
      setError(handleAxiosError(err, "Failed to create feedback"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssigneeSelect = (user: ApiUserType | null) => {
    setSelectedAssignee(user);
    setActiveModal(null);
  };

  const handleReceiversSave = (users: Receiver[]) => {
    setSelectedReceivers(users);
    setActiveModal(null);
  };

  const isFormValid = !!selectedAssignee?.id && content.trim().length > 0;

  if (!isOpen) return null;

  const modalContent = (
    <>
      <div className={css.overlay} style={{ zIndex: 1499 }} />
      <div ref={modalRef} className={css.modal}>
        {isCreating && (
          <div className={css.loadingOverlay} aria-busy aria-live="polite">
            <Loader size="large" inline />
          </div>
        )}
        <div className={css.header}>
          <h2 className={css.title}>Feedback</h2>
        </div>

        <div className={css.content}>
          <div className={css.field}>
            {selectedAssignee && (
              <div className={css.assigneeFieldRow}>
                <label className={css.label}>Assignee:</label>
                <span
                  className={css.assigneeTag}
                  onClick={() => setActiveModal(MODAL_TYPES.ASSIGNEE)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setActiveModal(MODAL_TYPES.ASSIGNEE)
                  }
                >
                  {selectedAssignee.name}
                </span>
              </div>
            )}
            {!selectedAssignee && (
              <div className={css.fieldRow}>
                <label className={css.label}>Assignee:</label>
                <button
                  type="button"
                  className={css.addButton}
                  onClick={() => setActiveModal(MODAL_TYPES.ASSIGNEE)}
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className={css.field}>
            <textarea
              id="feedback-content"
              className={css.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start type here..."
              maxLength={1000}
              disabled={isCreating}
            />
          </div>

          <p className={css.optionalNote}>*These fields are not obligatory</p>

          <div className={css.receiversField}>
            <label className={css.label}>Receivers:</label>
            {selectedReceivers.length > 0 && (
              <div className={css.receiversTags}>
                {selectedReceivers.map((user) => (
                  <span
                    key={user.id}
                    className={css.receiverTag}
                    onClick={() => setActiveModal(MODAL_TYPES.RECEIVERS)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setActiveModal(MODAL_TYPES.RECEIVERS)
                    }
                  >
                    {user.name}
                  </span>
                ))}
              </div>
            )}
            {selectedReceivers.length === 0 && (
              <span
                className={`${css.receiverTag} ${css.receiverAddPlaceholder}`}
                onClick={() => setActiveModal(MODAL_TYPES.RECEIVERS)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setActiveModal(MODAL_TYPES.RECEIVERS)
                }
              >
                Add
              </span>
            )}
          </div>

          {error && (
            <div className={css.error}>
              {handleAxiosError(error, "Failed to send feedback")}
            </div>
          )}

          <button
            type="button"
            className={css.sendButton}
            onClick={handleSubmit}
            disabled={!isFormValid || isCreating}
          >
            {isCreating && "Sending..."}
            {!isCreating && "Send"}
          </button>
        </div>
      </div>

      {activeModal === MODAL_TYPES.ASSIGNEE && (
        <UserSelectModal
          isOpen
          onClose={() => setActiveModal(null)}
          selectedUserId={selectedAssignee?.id ?? null}
          onSelect={handleAssigneeSelect}
          excludeUserId={currentUser?.id}
        />
      )}

      {activeModal === MODAL_TYPES.RECEIVERS && (
        <UsersMultiSelectModal
          isOpen
          onClose={() => setActiveModal(null)}
          selectedUserIds={selectedReceivers.map((r) => r.id)}
          onSave={handleReceiversSave}
          excludeUserId={currentUser?.id}
        />
      )}
    </>
  );

  return createPortal(modalContent, document.body);
}
