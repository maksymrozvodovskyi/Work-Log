import clsx from "clsx";
import Avatar from "@/components/Avatar";
import { useAuthStore } from "@/stores/authStore";
import { FEEDBACK_VIEW_TYPES, type FeedbackViewType } from "@/config/feedbacks";
import css from "@/features/feedbacks/index.module.css";

interface FeedbacksHeaderProps {
  view: FeedbackViewType;
  onViewChange: (view: FeedbackViewType) => void;
}

export default function FeedbacksHeader({ view, onViewChange }: FeedbacksHeaderProps) {
  const { user: currentUser } = useAuthStore();

  return (
    <header className={css.header}>
      <div className={css.headerLeft}>
        <div className={css.buttonsWrapper}>
          <span className={css.link}>Feedback</span>
          <nav className={css.navButtons} role="tablist">
            <button
              type="button"
              role="tab"
              className={clsx(css.tabButton, view === FEEDBACK_VIEW_TYPES.MY && css.activeTab)}
              onClick={() => onViewChange(FEEDBACK_VIEW_TYPES.MY)}
            >
              My feedbacks
            </button>
            <button
              type="button"
              role="tab"
              className={clsx(css.tabButton, view === FEEDBACK_VIEW_TYPES.ALL && css.activeTab)}
              onClick={() => onViewChange(FEEDBACK_VIEW_TYPES.ALL)}
            >
              All feedbacks
            </button>
          </nav>
        </div>
      </div>

      <div className={css.headerActions}>
        <button
          type="button"
          className={css.notificationButton}
        >
          <img src="/notification.svg" alt="" width="24" height="24" />
          <span className={css.notificationDot} />
        </button>
        <button
          type="button"
          className={css.profileButton}
        >
          {currentUser && <Avatar name={currentUser.name} status="GREEN" />}
        </button>
      </div>
    </header>
  );
}