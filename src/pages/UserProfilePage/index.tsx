import { useState } from "react";
import { useParams, Outlet, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { getUserById } from "@/api/users";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import { useClickOutside } from "@/hooks/useClickOutside";
import BackButton from "@/components/BackButton";
import ThreeDotsIcon from "@/components/svg/ThreeDotsIcon";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import css from "./index.module.css";

const USER_PROFILE_TABS = [
  { path: "resume", label: "Resume", end: true },
  { path: "time-tracker", label: "Time tracker", end: false },
  { path: "vacation", label: "Vacation", end: false },
  { path: "sub-technologies", label: "Sub Technologies", end: false },
  { path: "projects", label: "Projects", end: false },
  { path: "range", label: "Range", end: false },
  { path: "team", label: "Team", end: false },
  { path: "overtime", label: "Overtime", end: false },
  { path: "feedbacks", label: "Feedbacks", end: false },
] as const;

const UserProfilePage = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuButtonRef = useClickOutside<HTMLDivElement>(
    () => setIsDropdownOpen(false),
    isDropdownOpen
  );

  const { data: user, isLoading, isError } = useQuery({
    queryKey: [USER_QUERY_KEYS.users, userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className={css.page}>
        <div className={css.loaderWrapper}>
          <Loader size="medium" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className={css.page}>
        <div className={css.errorWrapper}>
          <span className={css.errorText}>Error loading user profile</span>
        </div>
      </div>
    );
  }

  return (
    <div className={css.page}>
      <header className={css.header}>
          <div className={css.headerLeft}>
            <BackButton />
            <Avatar name={user.name} status={user.status || "GREEN"} />
            <div className={css.userDetails}>
              <span className={css.userName}>{user.name}</span>
              <span className={css.userRole}>{user.role}</span>
            </div>
            <div className={css.menuButtonWrapper} ref={menuButtonRef}>
              <button
                type="button"
                className={css.menuButton}
                aria-label="Menu"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <ThreeDotsIcon fill="#8B97A3" />
              </button>
              <UserProfileDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
              />
            </div>
          </div>
          <div className={css.headerActions}>
            <button
              type="button"
              className={css.notificationButton}
              aria-label="Notifications"
            >
              <img
                src="/notification.svg"
                alt="Notifications"
                width="24"
                height="24"
              />
              <span className={css.notificationDot}></span>
            </button>
            <button
              type="button"
              className={css.profileButton}
              aria-label="User profile"
            >
              <Avatar name={user.name} status={user.status || "GREEN"} />
            </button>
          </div>
        </header>

        <nav className={css.navigation}>
          {USER_PROFILE_TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/users/${userId}/${tab.path}`}
              className={({ isActive }) =>
                clsx(css.navLink, isActive && css.navLinkActive)
              }
              end={tab.end}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className={css.content}>
          <div className={css.contentContainer}>
            <div className={css.headerDivider}></div>
            <Outlet />
          </div>
        </div>
    </div>
  );
};

export default UserProfilePage;
