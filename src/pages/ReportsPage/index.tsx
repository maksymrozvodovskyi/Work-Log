import { useQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { format, parseISO } from "date-fns";
import { getReports } from "@/api/reports";
import { useDebounce } from "@/hooks/useDebounce";
import { createSearchHandler } from "@/utils/filters";
import {
  parseAsReportSortField,
  parseAsReportActivityTypesWithWithout,
  parseAsReportHoursFilterArray,
  parsers,
} from "@/utils/parsers";
import { REPORTS_QUERY_KEYS } from "@/features/reports/queryKeys";
import { REPORTS_PER_PAGE } from "@/features/reports/constants";
import type {
  ReportSortFieldType,
  ActivityType,
  HoursFilterType,
} from "@/types/Report";
import css from "@/features/reports/index.module.css";
import ReportsTable from "@/features/reports/components/ReportsTable";
import ReportsFilterPanel from "@/features/reports/components/ReportsFilterPanel";
import ReportsDateNav from "@/features/reports/components/ReportsDateNav";
import SearchInput from "@/components/SearchInput";
import FilterButton from "@/components/FilterButton";
import Pagination from "@/components/Pagination";
import ReportsHeader from "@/features/reports/components/ReportsHeader";

const ReportsPage = () => {
  const [
    {
      search,
      page,
      date: dateString,
      sortField,
      sortDirection,
      activity,
      hours,
    },
    setFilters,
  ] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      date: parseAsString.withDefault(""),
      sortField: parseAsReportSortField.withDefault("name"),
      sortDirection: parsers.sortDirection().withDefault("asc"),
      activity: parseAsReportActivityTypesWithWithout.withDefault([]),
      hours: parseAsReportHoursFilterArray.withDefault([]),
    },
    {
      clearOnDefault: true,
    },
  );

  const debouncedSearchTerm = useDebounce(search, 500);

  const parsed = dateString ? parseISO(dateString) : null;

  const date = parsed && !isNaN(parsed.getTime()) ? parsed : new Date();

  const activityKey = activity.join(",");
  const hoursKey = hours.join(",");

  const {
    data: reportsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [
      REPORTS_QUERY_KEYS.reports,
      format(date, "yyyy-MM-dd"),
      debouncedSearchTerm,
      page,
      sortField,
      sortDirection,
      activityKey,
      hoursKey,
    ],
    queryFn: () =>
      getReports({
        date: format(date, "yyyy-MM-dd"),
        name: debouncedSearchTerm || undefined,
        activity: activity.length > 0 ? activity : undefined,
        hours: hours.length > 0 ? hours : undefined,
        skip: (page - 1) * REPORTS_PER_PAGE,
        take: REPORTS_PER_PAGE,
        sortField,
        sortDirection,
      }),
    placeholderData: (previousData) => previousData,
  });

  const reports = reportsData?.reports ?? [];
  const totalPages = reportsData?.totalPages ?? 0;

  const isDisabled = isLoading || isFetching;

  const handleSearchChange = createSearchHandler(setFilters);

  const handleDateChange = (newDate: Date) => {
    setFilters({
      date: format(newDate, "yyyy-MM-dd"),
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      date: "",
      page: 1,
      sortField: "name",
      sortDirection: "asc",
      activity: null,
      hours: null,
    });
  };

  const handleSort = (field: ReportSortFieldType) => {
    let nextDirection: "asc" | "desc" = "asc";

    if (sortField === field) {
      nextDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    setFilters({
      sortField: field,
      sortDirection: nextDirection,
      page: 1,
    });
  };

  const handleFiltersChange = (filters: {
    activities: ActivityType[];
    hours: HoursFilterType[];
  }) => {
    setFilters({
      activity: filters.activities,
      hours: filters.hours,
      page: 1,
    });
  };

  return (
    <div className={css.pageContainer}>
      <ReportsHeader />

      <section className={css.filterWrapper}>
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or tech"
          disabled={isDisabled}
        />
        <div className={css.dateNavWrapper}>
          <ReportsDateNav
            date={date}
            onDateChange={handleDateChange}
            disabled={isDisabled}
          />
        </div>
        <FilterButton onClick={handleClearFilters} disabled={isDisabled} />
      </section>

      <div className={css.contentRow}>
        <div className={css.mainContent}>
          {isError && (
            <div className={css.errorMessage}>{(error as Error).message}</div>
          )}

          <ReportsTable
            reports={reports}
            sort={{
              field: sortField,
              direction: sortDirection,
              onSort: handleSort,
            }}
            loading={{ isLoading, isFetching }}
          />

          {totalPages > 1 && (
            <div className={css.paginationWrapper}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={isDisabled}
              />
            </div>
          )}
        </div>

        <ReportsFilterPanel
          disabled={isDisabled}
          activities={activity}
          hours={hours}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  );
};

export default ReportsPage;
