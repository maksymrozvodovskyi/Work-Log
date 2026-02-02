import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import type { StatisticItemType } from "@/features/projects/types/timeline";
import css from "@/features/projects/index.module.css";

type TimelineHeaderProps = {
  statisticsConfig: StatisticItemType[];
};

export const TimelineHeader = ({ statisticsConfig }: TimelineHeaderProps) => {
  return (
    <header className={css.header}>
      <div className={css.headerLeft}>
        <div className={css.buttonsWrapper}>
          <Link to="/projects" className={css.link}>
            Projects
          </Link>
          <nav className={css.navButtons}>
            <NavLink
              to="/projects"
              end
              className={({ isActive }) =>
                clsx(css.tableButton, isActive && css.activeButton)
              }
            >
              Table
            </NavLink>
            <NavLink
              to="/projects/timeline"
              className={({ isActive }) =>
                clsx(css.timelineButton, isActive && css.activeButton)
              }
            >
              Timeline
            </NavLink>
          </nav>
        </div>

        <ul className={css.list}>
          {statisticsConfig.map((item) => (
            <li key={item.label} className={css.item}>
              <span
                className={clsx(
                  item.isMain && css.headerAllProjectsNumbers,
                  !item.isMain && css.headerNumbers
                )}
              >
                {item.value}
              </span>
              <span
                className={clsx(
                  item.isMain && css.headerAllProjects,
                  !item.isMain && css.headerText
                )}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={css.headerActions}>
        <button
          type="button"
          className={css.notificationButton}
          aria-label="Notifications"
        >
          <img src="/notification.svg" alt="" width="24" height="24" />
        </button>
        <button
          type="button"
          className={css.profileButton}
          aria-label="User profile"
        >
          <div className={css.profileAvatar}></div>
        </button>
      </div>
    </header>
  );
};

