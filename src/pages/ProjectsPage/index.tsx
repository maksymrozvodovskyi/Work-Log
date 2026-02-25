import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import clsx from "clsx";
import { getProjects } from "@/api/projects";
import { useDebounce } from "@/hooks/useDebounce";
import { useProjectSorting } from "@/hooks/useProjectSorting";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import type {
  SortFieldType,
  ProjectStatusType,
  ProjectType,
} from "@/types/Project";
import { PROJECT_STATUS_ORDER } from "@/features/projects/constants/projectStatusOrder";
import { statusMap } from "@/types/StatusMap";
import { parsers } from "@/utils/parsers";
import { createSearchHandler } from "@/utils/filters";
import css from "@/features/projects/index.module.css";
import ProjectTable from "@/features/projects/components/ProjectTable";
import SearchInput from "@/components/SearchInput";
import StatusFilter from "@/components/StatusFilter";
import FilterButton from "@/components/FilterButton";
import Pagination from "@/components/Pagination";
import ProjectModal from "@/features/projects/components/ProjectModal";
import PlusIcon from "@/components/svg/PlusIcon";
import { PROJECTS_PER_PAGE } from "@/features/projects/constants/pagination";

type StatisticItemType = {
  value: number;
  label: string;
  isMain?: boolean;
};

const parseAsProjectStatus =
  parsers.statusArray<ProjectStatusType>(PROJECT_STATUS_ORDER);

const ProjectsPage = () => {
  const location = useLocation();
  const isTableActive = location.pathname === "/projects";
  const isTimelineActive = location.pathname === "/projects/timeline";

  const { sortField, sortDirection, handleSortChange, setSortFilters } =
    useProjectSorting();
  const [{ search, page, statuses }, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    statuses: parseAsProjectStatus.withDefault([]),
  });

  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);

  const handleSearchChange = createSearchHandler(setFilters);
  const handleStatusChange = (newStatuses: ProjectStatusType[]) => {
    setFilters({
      statuses: newStatuses.length > 0 ? newStatuses : null,
      page: 1,
    });
  };

  const {
    data: paginatedProjects,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [
      PROJECT_QUERY_KEYS.projects,
      debouncedSearchTerm,
      sortField,
      sortDirection,
      page,
      statuses || null,
    ],
    queryFn: () =>
      getProjects({
        search: debouncedSearchTerm || undefined,
        sortField,
        sortDirection,
        skip: (page - 1) * PROJECTS_PER_PAGE,
        take: PROJECTS_PER_PAGE,
        status: statuses?.length ? statuses : undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });

  const projects = paginatedProjects?.data ?? [];
  const totalProjects = paginatedProjects?.total ?? 0;
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);
  const isDisabled = isLoading || isFetching;

  const statisticsConfig: StatisticItemType[] = useMemo(() => {
    const stats = paginatedProjects?.statistics;

    if (!stats) {
      return [
        { value: totalProjects, label: "All projects", isMain: true },
        ...PROJECT_STATUS_ORDER.map((status) => ({
          value: 0,
          label: statusMap[status].label,
        })),
      ];
    }

    return [
      { value: stats.total, label: "All projects", isMain: true },
      ...PROJECT_STATUS_ORDER.map((status) => ({
        value: stats.byStatus[status] ?? 0,
        label: statusMap[status].label,
      })),
    ];
  }, [paginatedProjects?.statistics, totalProjects]);

  const handleSort = (field: SortFieldType) => {
    handleSortChange(field);
    setFilters({ page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  const handleEditClick = (project: ProjectType) => {
    setSelectedProject(project);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleClearFilters = () => {
    if (sortDirection !== "asc" || sortField !== "name") {
      setSortFilters({
        sortField: "name",
        sortDirection: "asc",
      });
    }
    setFilters({
      search: "",
      statuses: null,
      page: 1,
    });
  };

  return (
    <div className={css.pageContainer}>
      <header className={css.header}>
        <div className={css.headerLeft}>
          <div className={css.buttonsWrapper}>
            <Link to="/projects" className={css.link}>
              Projects
            </Link>
            <nav className={css.navButtons}>
              <Link
                to="/projects"
                className={clsx(
                  css.tableButton,
                  isTableActive && css.activeButton,
                )}
              >
                Table
              </Link>
              <Link
                to="/projects/timeline"
                className={clsx(
                  css.timelineButton,
                  isTimelineActive && css.activeButton,
                )}
              >
                Timeline
              </Link>
            </nav>
          </div>

          <ul className={css.list}>
            {statisticsConfig.map((item, index) => {
              return (
                <li key={index} className={css.item}>
                  <span
                    className={clsx(
                      item.isMain && css.headerAllProjectsNumbers,
                      !item.isMain && css.headerNumbers,
                    )}
                  >
                    {item.value}
                  </span>
                  <span
                    className={clsx(
                      item.isMain && css.headerAllProjects,
                      !item.isMain && css.headerText,
                    )}
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
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

      <section className={css.filterWrapper} aria-labelledby="filter-section">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          disabled={isDisabled}
        />

        <div className={css.filterButtonsWrapper}>
          <div className={css.filterControls}>
            <FilterButton
              aria-label="Clear all filters"
              onClick={handleClearFilters}
              disabled={isDisabled}
            />

            <StatusFilter
              statusOrder={PROJECT_STATUS_ORDER}
              statusMap={statusMap}
              selectedStatuses={statuses || []}
              onStatusChange={handleStatusChange}
              entityType="projects"
              disabled={isDisabled}
            />
          </div>

          <button
            type="button"
            className={css.createButton}
            onClick={() => {
              setIsModalOpen(true);
              setSelectedProject(null);
            }}
            disabled={isDisabled}
          >
            Create project
            <PlusIcon />
          </button>
        </div>
      </section>

      {isError && <div>{(error as Error).message}</div>}

      <ProjectTable
        projects={projects}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditClick}
        isLoading={isLoading}
        isFetching={isFetching}
        disabled={isDisabled}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        disabled={isDisabled}
      />

      <ProjectModal
        isOpen={isModalOpen || selectedProject !== null}
        project={selectedProject}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ProjectsPage;
