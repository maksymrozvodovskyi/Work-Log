import { useState } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { startOfMonth, endOfMonth, format } from "date-fns";
import {
  ReportsHeaderLeft,
  ReportsHeaderRight,
} from "@/features/reports/components/ReportsHeader";
import SearchInput from "@/components/SearchInput";
import Loader from "@/components/Loader";
import { Calendar } from "@/features/worklogs/components/Calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { getReports, getCalendarDayReports } from "@/api/reports";
import { REPORTS_QUERY_KEYS } from "@/features/reports/queryKeys";
import { TIMELINE_REPORTS_PER_PAGE } from "@/features/reports/constants";
import ReportCard from "@/features/reports/components/ReportCard";
import Pagination from "@/components/Pagination";
import css from "@/features/reports/index.module.css";

type ReportTab = "MISSED" | "PROJECT" | "SPECIAL" | "OVERTIME";

const TAB_VARIANT: Record<ReportTab, "default" | "project" | "special"> = {
  MISSED: "default",
  PROJECT: "project",
  SPECIAL: "special",
  OVERTIME: "project",
};

const ReportsCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<ReportTab>("MISSED");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleTabChange = (tab: ReportTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setPage(1);
  };

  const debouncedSearch = useDebounce(search, 500);

  const {
    currentDate,
    calendarDays,
    handlePreviousMonth,
    handleNextMonth,
    handleToday: navigateToToday,
  } = useCalendar(selectedDate, selectedDate);

  const handleToday = () => {
    navigateToToday();
    setSelectedDate(new Date());
    setPage(1);
  };

  const { data: monthData } = useQuery({
    queryKey: [
      REPORTS_QUERY_KEYS.reports,
      REPORTS_QUERY_KEYS.calendarMonth,
      format(startOfMonth(currentDate), "yyyy-MM-dd"),
    ],
    queryFn: () =>
      getReports({
        startDate: format(startOfMonth(currentDate), "yyyy-MM-dd"),
        endDate: format(endOfMonth(currentDate), "yyyy-MM-dd"),
      }),
  });

  const activitiesByDate = monthData?.activitiesByDate ?? {};

  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const {
    data: timelineData,
    isLoading: isTimelineLoading,
    isFetching: isTimelineFetching,
  } = useQuery({
    queryKey: [
      REPORTS_QUERY_KEYS.reports,
      REPORTS_QUERY_KEYS.calendarDay,
      selectedDateStr,
      activeTab,
      debouncedSearch,
      page,
    ],
    queryFn: () =>
      getCalendarDayReports({
        date: selectedDateStr!,
        tab: activeTab,
        search: debouncedSearch,
        skip: (page - 1) * TIMELINE_REPORTS_PER_PAGE,
        take: TIMELINE_REPORTS_PER_PAGE,
      }),
    enabled: !!selectedDateStr,
  });

  const reports = timelineData?.reports ?? [];
  const totalPages = timelineData?.totalPages ?? 0;
  const showPagination = totalPages > 1;

  return (
    <div className={css.pageContainer}>
      <div className={css.calendarPageLayout}>
        <div className={css.calendarPageLeft}>
          <div className={css.calendarPageHeaderLeft}>
            <ReportsHeaderLeft />
          </div>
          <div className={css.calendarColumn}>
            <Calendar
              currentDate={currentDate}
              calendarDays={calendarDays}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              onDayClick={handleDayClick}
              activitiesByDate={activitiesByDate}
            />
          </div>
        </div>
        <div className={css.calendarPageRight}>
          <div className={css.calendarPageHeaderRight}>
            <h2 className={css.reportTimelineTitle}>Report Timeline</h2>
            <ReportsHeaderRight />
          </div>
          <div className={css.timelineColumn}>
            <div className={css.reportFiltersRow}>
              <div className={css.reportTabs}>
                <button
                  type="button"
                  className={clsx(
                    css.reportTab,
                    activeTab === "MISSED" && css.reportTabActive,
                  )}
                  onClick={() => handleTabChange("MISSED")}
                >
                  Missed reports
                </button>
                <button
                  type="button"
                  className={clsx(
                    css.reportTab,
                    activeTab === "PROJECT" && css.reportTabActive,
                  )}
                  onClick={() => handleTabChange("PROJECT")}
                >
                  Work on project
                </button>
                <button
                  type="button"
                  className={clsx(
                    css.reportTab,
                    activeTab === "SPECIAL" && css.reportTabActive,
                  )}
                  onClick={() => handleTabChange("SPECIAL")}
                >
                  Special
                </button>
                <button
                  type="button"
                  className={clsx(
                    css.reportTab,
                    activeTab === "OVERTIME" && css.reportTabActive,
                  )}
                  onClick={() => handleTabChange("OVERTIME")}
                >
                  Overtime
                </button>
              </div>
              <div className={css.reportSearchWrapper}>
                <SearchInput
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by name or tech."
                />
              </div>
            </div>
            <div className={css.timelineContent}>
              {!selectedDate ? (
                <div className={css.emptyState}>
                  Select a date to view timeline
                </div>
              ) : isTimelineLoading ? (
                <div className={css.timelineLoader}>
                  <Loader inline />
                </div>
              ) : (
                <>
                  <div className={css.reportCardsGrid}>
                    {reports.map((report) => (
                      <ReportCard
                        key={report.userId}
                        report={report}
                        variant={TAB_VARIANT[activeTab]}
                      />
                    ))}
                  </div>
                  {showPagination && (
                    <div className={css.paginationWrapper}>
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
                  {isTimelineFetching && (
                    <div className={css.timelineOverlay}>
                      <Loader inline />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsCalendarPage;
