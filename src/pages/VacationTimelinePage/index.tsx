import css from "./index.module.css";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useAuthStore } from "@/stores/authStore";
import Avatar from "@/components/Avatar";
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import DateNavLeftArrowIcon from "@/components/svg/DateNavLeftArrowIcon";
import DateNavRightArrowIcon from "@/components/svg/DateNavRightArrowIcon";
import FilterButton from "@/components/FilterButton";
import { getVacations } from "@/api/vacations";
import { useQuery } from "@tanstack/react-query";
import { VACATIONS_QUERY_KEY } from "@/features/vacations/queryKeys";
import VacationTimeline from "./components/VacationTimeline/index";
import UserListSection from "./components/UserListSection";
import Loader from "@/components/Loader";
import { TIMELINE_NAVIGATION_STEP_DAYS } from "@/features/vacations/constants/timeline";
import { getUserVacationStatus } from "./utils/vacationsStatus";

export default function VacationTimelinePage() {
  const { user: currentUser } = useAuthStore();

  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: vacations, isLoading } = useQuery({
    queryKey: [VACATIONS_QUERY_KEY.vacations],
    queryFn: () =>
      getVacations({
        skip: 0,
        take: 5,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  const handlePreviousPeriod = () => {
    setCurrentDate(subDays(currentDate, TIMELINE_NAVIGATION_STEP_DAYS));
  };

  const handleNextPeriod = () => {
    setCurrentDate(addDays(currentDate, TIMELINE_NAVIGATION_STEP_DAYS));
  };

  const handleClearFilters = () => {
    setCurrentDate(new Date());
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const periodMonth = format(currentDate, "MMM");
  const periodYear = format(currentDate, "yyyy");

  const usersWithStatus =
    vacations?.items.map((user) => ({
      ...user,
      vacationStatus: getUserVacationStatus(user.workLogs),
    })) || [];

  const isInitialLoading = isLoading && usersWithStatus.length === 0;

  const futureUsers = usersWithStatus.filter(
    (user) => user.vacationStatus.future.length > 0,
  );

  const activeUsers = usersWithStatus.filter(
    (user) => user.vacationStatus.active.length > 0,
  );

  const usedUsers = usersWithStatus.filter(
    (user) => user.vacationStatus.used.length > 0,
  );

  if (isInitialLoading) {
    return (
      <div className={css.pageLoader}>
        <Loader size="large" inline />
      </div>
    );
  }

  return (
    <div className={css.pageContainer}>
      <div className={css.wrapper}>
        <main className={css.mainContent}>
          <header className={css.header}>
            <div className={css.headerLeft}>
              <div className={css.linksWrap}>
                <NavLink to="/vacations" className={css.brandTitle}>
                  Vacations
                </NavLink>

                <nav className={css.tabs}>
                  <NavLink
                    to="/vacations"
                    end
                    className={({ isActive }) =>
                      clsx(css.tabsItem, isActive && css.tabsItemActive)
                    }
                  >
                    Main
                  </NavLink>
                  <NavLink
                    to="/vacations/timeline"
                    className={({ isActive }) =>
                      clsx(css.tabsItem, isActive && css.tabsItemActive)
                    }
                  >
                    Timeline
                  </NavLink>
                </nav>
              </div>

              <div className={css.statusWrap}>
                <div className={css.statusItem}>
                  <span className={css.statusCount}>{activeUsers.length}</span>
                  <span className={css.status}>Active</span>
                </div>

                <div className={css.statusItem}>
                  <span className={css.statusCount}>{futureUsers.length}</span>
                  <span className={css.status}>Future</span>
                </div>

                <div className={css.statusItem}>
                  <span className={css.statusCount}>{usedUsers.length}</span>
                  <span className={css.status}>Used</span>
                </div>
              </div>
            </div>
          </header>

          <section className={css.controlsSection}>
            <div className={css.controlsLeft}>
              <button
                type="button"
                className={css.MonthBtn}
                onClick={handlePreviousPeriod}
                disabled={isLoading}
              >
                <DateNavLeftArrowIcon />
              </button>
              <button
                type="button"
                className={css.MonthBtn}
                onClick={handleNextPeriod}
                disabled={isLoading}
              >
                <DateNavRightArrowIcon />
              </button>
              <span className={css.dateText}>
                <span className={css.dateMonth}>{periodMonth}</span>
                <span className={css.dateYear}>{periodYear}</span>
              </span>
              <button
                type="button"
                className={css.todayBtn}
                onClick={handleToday}
              >
                Today
              </button>
            </div>

            <div className={css.controlsRight}>
              <FilterButton onClick={handleClearFilters} />
            </div>
          </section>

          <section className={css.timelineSection}>
            <VacationTimeline
              currentDate={currentDate}
              users={usersWithStatus}
            />
          </section>
        </main>
      </div>

      <div className={css.rightSidebar}>
        <div className={css.rightSidebarContainer}>
          <div className={css.rightSidebarTop}>
            <button type="button" className={css.notificationButton}>
              <img src="/notification.svg" alt="" width="24" height="24" />
            </button>

            <button type="button" className={css.profileButton}>
              {currentUser && <Avatar name={currentUser.name} status="GREEN" />}
            </button>
          </div>

          <div className={css.usersList}>
            <div className={css.usersListWrap}>
              <h2 className={css.usersListTitle}>Users list</h2>
            </div>

            <div className={css.usersListContent}>
              {isLoading ? (
                <div className={css.usersListLoader}>
                  <Loader size="medium" inline />
                </div>
              ) : (
                <>
                  <UserListSection
                    title="Future"
                    users={futureUsers}
                    statsKey="future"
                  />
                  <UserListSection
                    title="Active"
                    users={activeUsers}
                    statsKey="active"
                  />
                  <UserListSection
                    title="Used"
                    users={usedUsers}
                    statsKey="used"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
