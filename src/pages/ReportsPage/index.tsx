import { Link, useLocation } from "react-router-dom";
import { format, addDays, subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsString } from "nuqs";
import clsx from "clsx";
import Avatar from "@/components/Avatar";
import SearchInput from "@/components/SearchInput";
import FilterButton from "@/components/FilterButton";
import ArrowIcon from "@/components/svg/ArrowIcon";
import { useAuthStore } from "@/stores/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import { getReportsUsers, getReportsCounts } from "@/api/reports";
import {
  transformApiUserToUserRange,
  type ApiUserType,
} from "@/utils/userTransformers";
import type { PaginatedResponseType } from "@/types/Project";
import type { ActivityType } from "@/types/WorkLog";
import ReportsUserTable, {
  type ReportsSortFieldType,
} from "@/features/reports/components/ReportsUserTable";
import ReportsFilterPanel from "@/features/reports/components/ReportsFilterPanel";
import { ReportsCalendar } from "@/features/reports/components/ReportsCalendar";
import { ReportsTimeline } from "@/features/reports/components/ReportsTimeline";
import {
  parseAsReportDate,
  parseAsReportActivityTypes,
  parseAsHoursFilter,
  parseAsReportSortField,
  parseAsReportType,
} from "@/utils/parsers";
import { parsers } from "@/utils/parsers";
import css from "./ReportsPage.module.css";

const REPORTS_USERS_TAKE = 20;

const parseAsSortDirection = parsers.sortDirection();

export default function ReportsPage() {
  const location = useLocation();
  const { user: currentUser } = useAuthStore();
  const isMainActive = location.pathname === "/reports";
  const isCalendarActive = location.pathname === "/reports/calendar";

  const [
    {
      search,
      date: dateStr,
      sortField,
      sortDirection,
      activityTypes: selectedTrackStatuses,
      hoursFilter: selectedHours,
      reportType: selectedReportType,
    },
    setFilters,
  ] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      date: parseAsReportDate.withDefault(format(new Date(), "yyyy-MM-dd")),
      sortField: parseAsReportSortField.withDefault("name"),
      sortDirection: parseAsSortDirection.withDefault("asc"),
      activityTypes: parseAsReportActivityTypes.withDefault([]),
      hoursFilter: parseAsHoursFilter,
      reportType: parseAsReportType,
    },
    { shallow: false },
  );

  const selectedDate = dateStr ? new Date(dateStr) : new Date();
  const debouncedSearchTerm = useDebounce(search, 500);

  const apiSortField = sortField === "total" ? "status" : sortField;
  const effectiveReportType = selectedReportType ?? "missed";

  const {
    data: paginatedUsers,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useQuery({
    queryKey: [
      "reports",
      "users",
      debouncedSearchTerm,
      apiSortField,
      sortDirection,
      dateStr,
      isCalendarActive ? effectiveReportType : null,
      isCalendarActive ? null : selectedTrackStatuses,
      isCalendarActive ? null : selectedHours,
    ],
    queryFn: () =>
      getReportsUsers({
        date: dateStr || format(new Date(), "yyyy-MM-dd"),
        name: debouncedSearchTerm || undefined,
        sortField: apiSortField,
        sortOrder: sortDirection,
        skip: 0,
        take: REPORTS_USERS_TAKE,
        ...(isCalendarActive
          ? { reportType: effectiveReportType }
          : {
              activityTypes:
                selectedTrackStatuses.length > 0
                  ? selectedTrackStatuses
                  : undefined,
              hoursFilter: selectedHours ?? undefined,
            }),
      }),
    select: (data: PaginatedResponseType<ApiUserType>) => ({
      data: data.data.map((user) => transformApiUserToUserRange(user)),
      total: data.total,
    }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: reportsCounts,
    isLoading: isLoadingCounts,
    isFetching: isFetchingCounts,
  } = useQuery({
    queryKey: ["reports", "counts", dateStr],
    queryFn: () => getReportsCounts(dateStr || format(new Date(), "yyyy-MM-dd")),
    enabled: isCalendarActive,
    staleTime: 1000 * 60 * 5,
  });

  const users = paginatedUsers?.data ?? [];
  const counts = reportsCounts ?? {
    missed: 0,
    work: 0,
    special: 0,
    overtime: 0,
  };
  const isUsersDisabled = isLoadingUsers || isFetchingUsers;

  const handlePreviousDay = () => {
    const prevDate = subDays(selectedDate, 1);
    setFilters({ date: format(prevDate, "yyyy-MM-dd") });
  };

  const handleNextDay = () => {
    const nextDate = addDays(selectedDate, 1);
    setFilters({ date: format(nextDate, "yyyy-MM-dd") });
  };

  const handleToday = () => {
    setFilters({ date: format(new Date(), "yyyy-MM-dd") });
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      date: format(new Date(), "yyyy-MM-dd"),
      activityTypes: [],
      hoursFilter: null,
    });
  };

  const handleSearchChange = (value: string) => setFilters({ search: value });

  const handleSort = (field: ReportsSortFieldType) => {
    if (sortField === field) {
      setFilters({
        sortDirection: sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setFilters({ sortField: field, sortDirection: "asc" });
    }
  };

  const handleTrackStatusToggle = (status: ActivityType) => {
    const next = selectedTrackStatuses.includes(status)
      ? selectedTrackStatuses.filter((s) => s !== status)
      : [...selectedTrackStatuses, status];
    setFilters({ activityTypes: next.length > 0 ? next : null });
  };

  const handleHoursToggle = (option: "<8h" | "8h" | "8h>") => {
    setFilters({
      hoursFilter: selectedHours === option ? null : option,
    });
  };

  const handleReportTypeChange = (type: "missed" | "work" | "special" | "overtime" | null) => {
    setFilters({ reportType: type });
  };

  const handleDateChange = (date: Date) => {
    setFilters({ date: format(date, "yyyy-MM-dd") });
  };

  const formattedDate = format(selectedDate, "d MMM yyyy");

  const headerActions = (
    <>
      <button
        type="button"
        className={css.notificationButton}
        aria-label="Notifications"
      >
        <img src="/notification.svg" alt="" width="24" height="24" />
        <span className={css.notificationDot} />
      </button>
      <button
        type="button"
        className={css.profileButton}
        aria-label="User profile"
      >
        {currentUser && <Avatar name={currentUser.name} status="GREEN" />}
      </button>
    </>
  );

  return (
    <div className={css.pageContainer}>
      {isCalendarActive ? (
        <div className={css.calendarLayout}>
          <div className={css.calendarLeftPane}>
            <div className={css.calendarTabs}>
              <span className={css.link}>Reports</span>
              <nav className={css.navButtons} role="tablist">
                <Link
                  to="/reports"
                  role="tab"
                  className={clsx(css.tabButton, isMainActive && css.activeTab)}
                >
                  Main
                </Link>
                <Link
                  to="/reports/calendar"
                  role="tab"
                  className={clsx(
                    css.tabButton,
                    isCalendarActive && css.activeTab,
                  )}
                >
                  Calendar
                </Link>
              </nav>
            </div>
            <div className={css.calendarWrapper}>
                <ReportsCalendar
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
          <div className={css.calendarRightPane}>
            <ReportsTimeline
              data={{ users, counts }}
              filters={{ selectedReportType, search }}
              callbacks={{
                onReportTypeChange: handleReportTypeChange,
                onSearchChange: handleSearchChange,
              }}
              isLoading={
                isLoadingUsers ||
                isFetchingUsers ||
                isLoadingCounts ||
                isFetchingCounts
              }
              headerActions={headerActions}
            />
          </div>
        </div>
      ) : (
        <>
          <header className={css.header}>
            <div className={css.headerLeft}>
              <div className={css.buttonsWrapper}>
                <span className={css.link}>Reports</span>
                <nav className={css.navButtons} role="tablist">
                  <Link
                    to="/reports"
                    role="tab"
                    className={clsx(css.tabButton, isMainActive && css.activeTab)}
                  >
                    Main
                  </Link>
                  <Link
                    to="/reports/calendar"
                    role="tab"
                    className={clsx(
                      css.tabButton,
                      isCalendarActive && css.activeTab,
                    )}
                  >
                    Calendar
                  </Link>
                </nav>
              </div>
            </div>

            <div className={css.headerActions}>
              {headerActions}
            </div>
          </header>

          {isMainActive && (
            <section className={css.filterWrapper} aria-labelledby="filter-section">
              <SearchInput
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name or tech"
                ariaLabel="Search reports by name or tech"
              />

              <div className={css.dateNavigationWrapper}>
                <div className={css.dateNavigation}>
                  <button
                    type="button"
                    className={css.dateNavButton}
                    onClick={handlePreviousDay}
                    aria-label="Previous day"
                  >
                    <ArrowIcon style={{ transform: "rotate(90deg)" }} />
                  </button>
                  <button
                    type="button"
                    className={css.dateNavButton}
                    onClick={handleNextDay}
                    aria-label="Next day"
                  >
                    <ArrowIcon style={{ transform: "rotate(-90deg)" }} />
                  </button>
                  <span className={css.dateText}>{formattedDate}</span>
                  <button
                    type="button"
                    className={css.todayButton}
                    onClick={handleToday}
                  >
                    Today
                  </button>
                </div>
              </div>

              <div className={css.filterButtonWrapper}>
                <FilterButton
                  onClick={handleClearFilters}
                  ariaLabel="Clear all filters"
                />
              </div>
            </section>
          )}

          <div className={css.mainContent}>
            <ReportsUserTable
              users={users}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              isLoading={isLoadingUsers}
              isFetching={isFetchingUsers}
              disabled={isUsersDisabled}
              selectedTrackStatuses={selectedTrackStatuses}
              selectedHours={selectedHours}
            />
            <ReportsFilterPanel
              selectedTrackStatuses={selectedTrackStatuses as ActivityType[]}
              selectedHours={selectedHours ?? null}
              onTrackStatusToggle={handleTrackStatusToggle}
              onHoursToggle={handleHoursToggle}
            />
          </div>
        </>
      )}
    </div>
  );
}
