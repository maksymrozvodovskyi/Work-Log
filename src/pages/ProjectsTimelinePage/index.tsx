import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { startOfMonth, endOfMonth } from "date-fns";
import clsx from "clsx";
import { useCalendar } from "@/hooks/useCalendar";
import { useTimelineDates } from "@/hooks/useTimelineDates";
import { useProjectPosition } from "@/hooks/useProjectPosition";
import { useTimelineUsers } from "@/hooks/useTimelineUsers";
import { getProjects } from "@/api/projects";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import { PROJECT_STATUS_ORDER } from "@/features/projects/constants/projectStatusOrder";
import { statusMap } from "@/types/StatusMap";
import { parsers } from "@/utils/parsers";
import type { ProjectStatusType } from "@/types/Project";
import type { StatisticItemType } from "@/features/projects/types/timeline";
import css from "@/features/projects/index.module.css";
import { TimelineProvider } from "@/features/projects/context/TimelineContext";
import { TimelineHeader } from "@/features/projects/components/TimelineHeader";
import { TimelineFilterBar } from "@/features/projects/components/TimelineFilterBar";
import { UsersSidebar } from "@/features/projects/components/UsersSidebar";
import { TimelineGrid } from "@/features/projects/components/TimelineGrid";
import Button from "@/components/Auth/Button";
import Loader from "@/components/Loader";

const parseAsProjectStatus =
  parsers.statusArray<ProjectStatusType>(PROJECT_STATUS_ORDER);

const ProjectsTimelinePage = () => {
  const [{ statuses }, setFilters] = useQueryStates({
    statuses: parseAsProjectStatus.withDefault([]),
  });

  const { currentDate, handlePreviousMonth, handleNextMonth, handleToday } =
    useCalendar(null, null);
  const timelineDates = useTimelineDates(currentDate);

  const {
    users,
    userSearch,
    setUserSearch,
    isLoadingUsers,
    isLoadingMore,
    hasMore,
    loadMoreUsers,
  } = useTimelineUsers();

  const {
    data: projectsData,
    isLoading: isLoadingProjects,
    isFetching: isFetchingProjects,
  } = useQuery({
    queryKey: [PROJECT_QUERY_KEYS.projects, "all", statuses || null],
    queryFn: () =>
      getProjects({
        status: statuses?.length ? statuses : undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const projects = projectsData?.data ?? [];

  const statisticsConfig: StatisticItemType[] = useMemo(() => {
    const statistics = projectsData?.statistics;
    if (!statistics) {
      return [];
    }

    return [
      { value: statistics.total, label: "All projects", isMain: true },
      ...PROJECT_STATUS_ORDER.map((statusItem) => ({
        value: statistics.byStatus[statusItem] || 0,
        label: statusMap[statusItem].label,
      })),
    ];
  }, [projectsData]);

  const getProjectPosition = useProjectPosition(timelineDates);

  const monthBounds = useMemo(
    () => ({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    }),
    [currentDate],
  );

  const todayDate = new Date();

  const handleStatusChange = useCallback(
    (newStatuses: ProjectStatusType[]) => {
      setFilters({
        statuses: newStatuses.length > 0 ? newStatuses : null,
      });
    },
    [setFilters],
  );

  const handleClearFilters = useCallback(() => {
    setFilters({ statuses: null });
    setUserSearch("");
    handleToday();
  }, [setFilters, setUserSearch, handleToday]);

  const isDisabled = isLoadingProjects || isFetchingProjects || isLoadingUsers;
  const hasProjects = projects.length > 0;
  const showTimelineInitialLoader = isLoadingProjects && !hasProjects;

  const filterState = {
    statuses,
    isDisabled,
  };

  const filterActions = useMemo(
    () => ({
      onStatusChange: handleStatusChange,
      onClearFilters: handleClearFilters,
      onPreviousMonth: handlePreviousMonth,
      onNextMonth: handleNextMonth,
    }),
    [
      handleStatusChange,
      handleClearFilters,
      handlePreviousMonth,
      handleNextMonth,
    ],
  );

  const usersState = {
    userSearch,
    isLoadingUsers,
  };

  const usersActions = {
    onSearchChange: setUserSearch,
  };

  return (
    <TimelineProvider
      value={{
        projects,
        users,
        timelineDates,
        currentDate,
        monthBounds,
        todayDate,
        isLoadingUsers,
      }}
    >
      <div className={clsx(css.pageContainer, css.timelinePageContainer)}>
        <TimelineHeader statisticsConfig={statisticsConfig} />

        <TimelineFilterBar state={filterState} actions={filterActions} />

        <div className={css.timelineContent}>
          <UsersSidebar state={usersState} actions={usersActions} />

          <div className={css.timelineGridWrapper}>
            <TimelineGrid
              getProjectPosition={getProjectPosition}
              showInitialLoader={showTimelineInitialLoader}
            />
            {hasMore && (
              <div className={css.loadMoreWrapper}>
                {isLoadingMore ? (
                  <Loader size="medium" className={css.loadMoreLoader} />
                ) : (
                  <Button
                    onClick={loadMoreUsers}
                    className={css.loadMoreButton}
                    variant="secondary"
                  >
                    Load More
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </TimelineProvider>
  );
};

export default ProjectsTimelinePage;
