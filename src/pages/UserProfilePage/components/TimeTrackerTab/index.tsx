import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { startOfMonth, endOfMonth, subDays, addDays } from "date-fns";

import SquaresIcon from "@/components/svg/SquaresIcon";
import ResultsDownloadIcon from "@/components/svg/ResultsDownloadIcon";
import ProjectsSelectModal from "@/features/worklogs/components/ProjectsSelectModal";
import { getWorkLogsByTime } from "@/api/worklogs";
import Loader from "@/components/Loader";
import FilterButton from "@/components/FilterButton";
import { WORKLOG_QUERY_KEYS } from "@/features/worklogs/queryKeys";
import {
  groupWorkLogsByProject,
  getWorkLogsByDateWithActivity,
} from "@/features/worklogs/utils/groupWorkLogs";
import { Calendar } from "@/features/worklogs/components/Calendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useCalendar } from "@/hooks/useCalendar";
import { useProjectsModal } from "@/hooks/useProjectsModal";
import { formatDateDisplay, formatDateForApi } from "@/utils/dateUtils";
import PeriodInput from "@/components/PeriodInput";

import css from "./TimeTrackerTab.module.css";
import sharedCss from "@/features/worklogs/index.module.css";

const TimeTrackerTab = () => {
  const { id: userId } = useParams<{ id: string }>();

  const dateRange = useDateRange();
  const calendar = useCalendar(
    dateRange.localStartDate,
    dateRange.localEndDate,
  );

  const projectsModal = useProjectsModal({
    defaultDisplayText: "No projects",
    getDisplayText: (count) => `Selected ${count}`,
  });

  const calendarMonthStart = startOfMonth(calendar.currentDate);
  const calendarMonthEnd = endOfMonth(calendar.currentDate);

  const firstVisibleDay = subDays(calendarMonthStart, 6);
  const lastVisibleDay = addDays(calendarMonthEnd, 6);

  const calendarMonthStartString = formatDateForApi(firstVisibleDay);
  const calendarMonthEndString = formatDateForApi(lastVisibleDay);

  const {
    data: workLogsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      WORKLOG_QUERY_KEYS.worklogs,
      userId,
      dateRange.startDateString,
      dateRange.endDateString,
      "asc",
    ],
    queryFn: () =>
      getWorkLogsByTime(
        userId!,
        dateRange.startDateString!,
        dateRange.endDateString!,
        "asc",
      ),
    enabled:
      Boolean(userId) &&
      Boolean(dateRange.startDateString) &&
      Boolean(dateRange.endDateString),
  });

  const { data: calendarWorkLogsData } = useQuery({
    queryKey: [
      WORKLOG_QUERY_KEYS.worklogs,
      userId,
      "calendar",
      calendarMonthStartString,
      calendarMonthEndString,
      "asc",
    ],
    queryFn: () =>
      getWorkLogsByTime(
        userId!,
        calendarMonthStartString!,
        calendarMonthEndString!,
        "asc",
      ),
    enabled:
      Boolean(userId) &&
      Boolean(calendarMonthStartString) &&
      Boolean(calendarMonthEndString),
  });

  const groupedWorkLogs = groupWorkLogsByProject(
    workLogsData,
    projectsModal.selectedProjectIds,
  );

  const workLogsByDate = getWorkLogsByDateWithActivity(calendarWorkLogsData);

  const isEmpty = !isLoading && !isError && groupedWorkLogs.length === 0;

  const hasResults = !isLoading && !isError && groupedWorkLogs.length > 0;

  const handleDayClick = (date: Date) => {
    dateRange.handleDayClick(date);
    calendar.navigateToDate(date);
  };

  const handleToday = () => {
    dateRange.handleToday();
    calendar.handleToday();
  };

  const handleDateFieldClick = (field: "start" | "end") => {
    dateRange.setActiveDateField(field);
  };

  return (
    <div className={sharedCss.content}>
      <div className={css.timeTrackerWrapper}>
        <Calendar
          currentDate={calendar.currentDate}
          calendarDays={calendar.calendarDays}
          onPreviousMonth={calendar.handlePreviousMonth}
          onNextMonth={calendar.handleNextMonth}
          onToday={handleToday}
          onDayClick={handleDayClick}
          workLogsByDate={workLogsByDate}
          calendarWorkLogsData={calendarWorkLogsData}
        />

        <div className={css.timeTrackerSection}>
          <h3 className={css.timeTrackerTitle}>Time tracker</h3>

          <div className={css.timeTrackerContent}>
            <div className={css.periodSection}>
              <label className={css.periodLabel}>Period</label>

              <div className={css.periodInputs}>
                <PeriodInput
                  type="start"
                  value={formatDateDisplay(dateRange.localStartDate)}
                  placeholder="31.10.2017"
                  isActive={dateRange.activeDateField === "start"}
                  onClick={() => handleDateFieldClick("start")}
                />

                <div className={css.periodDivider} />

                <PeriodInput
                  type="end"
                  value={formatDateDisplay(dateRange.localEndDate)}
                  placeholder="Today"
                  isActive={dateRange.activeDateField === "end"}
                  onClick={() => handleDateFieldClick("end")}
                />
              </div>
            </div>

            <div className={css.projectsSection}>
              <label className={css.projectsLabel}>Projects</label>

              <div className={css.projectsInputRow}>
                <div className={css.projectsInputWrapper}>
                  <input
                    type="text"
                    className={css.projectsInput}
                    placeholder="No projects"
                    value={projectsModal.getDisplayText()}
                    readOnly
                    onClick={projectsModal.openModal}
                  />

                  <button
                    type="button"
                    className={css.gridIconButton}
                    aria-label="Open projects selector"
                    onClick={projectsModal.openModal}
                  >
                    <SquaresIcon />
                  </button>
                </div>
                <FilterButton ariaLabel="Filter projects" />
              </div>
            </div>
          </div>
        </div>

        <div className={css.resultsSection}>
          <h3 className={css.resultsTitle}>
            Results
            <ResultsDownloadIcon className={css.resultsDownloadIcon} />
          </h3>

          {isLoading && (
            <div className={css.resultsPlaceholder}>
              <Loader size="small" />
            </div>
          )}

          {isError && (
            <div className={css.resultsPlaceholder}>
              <span className={css.resultsPlaceholderText}>
                Error loading results
              </span>
            </div>
          )}

          {isEmpty && (
            <div className={css.resultsPlaceholder}>
              <span className={css.resultsPlaceholderText}>No results</span>
            </div>
          )}

          {hasResults && (
            <div className={css.resultsContent}>
              <div className={css.resultsProjectsList}>
                {groupedWorkLogs.map((project) => (
                  <div
                    key={project.projectId}
                    className={css.resultsProjectItem}
                  >
                    <span className={css.resultsProjectName}>
                      {project.projectName}
                    </span>
                    <span className={css.resultsProjectHours}>
                      {project.totalHours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectsSelectModal
        isOpen={projectsModal.isModalOpen}
        onClose={projectsModal.closeModal}
        selectedProjectIds={projectsModal.selectedProjectIds}
        onSave={projectsModal.saveProjects}
        userId={userId!}
      />
    </div>
  );
};

export default TimeTrackerTab;
