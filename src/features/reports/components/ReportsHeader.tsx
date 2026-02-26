import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { useAuthStore } from "@/stores/authStore";
import Avatar from "@/components/Avatar";
import css from "@/features/reports/index.module.css";

export const ReportsHeaderLeft = () => (
  <div className={css.headerLeft}>
    <div className={css.buttonsWrapper}>
      <Link to="/reports" className={css.reportLink}>
        Reports
      </Link>

      <NavLink
        to="/reports"
        end
        className={({ isActive }) =>
          clsx(css.mainButton, isActive && css.mainButtonActive)
        }
      >
        Main
      </NavLink>

      <NavLink
        to="/reports/calendar"
        className={({ isActive }) =>
          clsx(css.calendarButton, isActive && css.calendarButtonActive)
        }
      >
        Calendar
      </NavLink>
    </div>
  </div>
);

export const ReportsHeaderRight = () => {
  const { user: currentUser } = useAuthStore();

  return (
    <div className={css.headerActions}>
      <button type="button" className={css.notificationButton}>
        <img src="/notification.svg" alt="" width="24" height="24" />
        <span className={css.notificationDot} />
      </button>

      <button type="button" className={css.profileButton}>
        {currentUser && <Avatar name={currentUser.name} status="GREEN" />}
      </button>
    </div>
  );
};

const ReportsHeader = () => (
  <header className={css.header}>
    <ReportsHeaderLeft />
    <ReportsHeaderRight />
  </header>
);

export default ReportsHeader;
