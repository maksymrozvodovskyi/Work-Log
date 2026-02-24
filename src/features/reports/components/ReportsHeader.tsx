import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Avatar from "@/components/Avatar";
import css from "@/features/reports/index.module.css";

const getNavClass =
  (base: string, active: string) =>
  ({ isActive }: { isActive: boolean }) =>
    isActive ? `${base} ${active}` : base;

const ReportsHeader = () => {
  const { user: currentUser } = useAuthStore();

  return (
    <header className={css.header}>
      <div className={css.headerLeft}>
        <div className={css.buttonsWrapper}>
          <Link to="/reports" className={css.reportLink}>
            Reports
          </Link>

          <NavLink
            to="/reports"
            end
            className={getNavClass(css.mainButton, css.mainButtonActive)}
          >
            Main
          </NavLink>

          <NavLink
            to="/reports/calendar"
            className={getNavClass(
              css.calendarButton,
              css.calendarButtonActive,
            )}
          >
            Calendar
          </NavLink>
        </div>
      </div>

      <div className={css.headerActions}>
        <button type="button" className={css.notificationButton}>
          <img src="/notification.svg" alt="" width="24" height="24" />
          <span className={css.notificationDot} />
        </button>

        <button type="button" className={css.profileButton}>
          {currentUser && <Avatar name={currentUser.name} status="GREEN" />}
        </button>
      </div>
    </header>
  );
};

export default ReportsHeader;
