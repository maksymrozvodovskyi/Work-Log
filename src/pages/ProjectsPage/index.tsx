import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import clsx from "clsx";
import { getProjects } from "@/api/projects";
import { useDebounce } from "@/hooks/useDebounce";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import type { SortField, ProjectStatus, Project } from "@/types/Project";
import { PROJECT_STATUS_ORDER } from "@/features/projects/constants/projectStatusOrder";
import { statusMap } from "@/types/StatusMap";
import { parsers } from "@/utils/parsers";
import { createSearchHandler, createStatusHandler } from "@/utils/filters";
import { SORT_FIELDS, DEFAULT_SORT_FIELD } from "@/constants/sort";
import css from "@/features/projects/index.module.css";
import ProjectTable from "@/features/projects/components/ProjectTable";
import SearchInput from "@/features/projects/components/SearchInput";
import StatusFilter from "@/components/StatusFilter";
import Pagination from "@/features/projects/components/Pagination";
import Loader from "@/features/projects/components/Loader";
import ProjectModal from "@/features/projects/components/ProjectModal";
import PlusIcon from "@/features/projects/svg/PlusIcon";
import { PROJECTS_PER_PAGE } from "@/features/projects/constants/pagination";

type StatisticItem = {
  value: number | ((totalProjects: number) => number);
  label: string;
  isMain?: boolean;
};

const parseAsSortField = parsers.sortField<SortField>(
  [...SORT_FIELDS],
  DEFAULT_SORT_FIELD
);

const parseAsSortDirection = parsers.sortDirection();

const parseAsProjectStatus =
  parsers.status<ProjectStatus>(PROJECT_STATUS_ORDER);

const statisticsConfig: StatisticItem[] = [
  {
    value: (totalProjects) => totalProjects,
    label: "All projects",
    isMain: true,
  },
  { value: 100, label: "Time & material" },
  { value: 56, label: "Fixed time" },
  { value: 5, label: "Archived" },
];

const ProjectsPage = () => {
  const [{ search, sortField, sortDirection, page, status }, setFilters] =
    useQueryStates({
      search: parseAsString.withDefault(""),
      sortField: parseAsSortField.withDefault("name"),
      sortDirection: parseAsSortDirection.withDefault("asc"),
      page: parseAsInteger.withDefault(1),
      status: parseAsProjectStatus,
    });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);

  const handleSearchChange = createSearchHandler(setFilters);
  const handleStatusChange = createStatusHandler<ProjectStatus>(setFilters);

  const {
    data: paginatedProjects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      PROJECT_QUERY_KEYS.projects,
      debouncedSearchTerm,
      sortField,
      sortDirection,
      page,
      status,
    ],
    queryFn: () =>
      getProjects({
        search: debouncedSearchTerm || undefined,
        sortField,
        sortDirection,
        skip: (page - 1) * PROJECTS_PER_PAGE,
        take: PROJECTS_PER_PAGE,
        status: status || undefined,
      }),
  });

  const projects = paginatedProjects?.data ?? [];
  const totalProjects = paginatedProjects?.total ?? 0;
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setFilters({
        sortDirection: sortDirection === "asc" ? "desc" : "asc",
        page: 1,
      });
    } else {
      setFilters({
        sortField: field,
        sortDirection: "asc",
        page: 1,
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: null,
      sortField: "name",
      sortDirection: "asc",
      page: 1,
    });
  };

  return (
    <div>
      <header className={css.header}>
        <div className={css.headerLeft}>
          <div className={css.buttonsWrapper}>
            <h1 className={css.link}>Projects</h1>
            <nav className={css.navButtons}>
              <button className={css.tableButton}>Table</button>
            </nav>
          </div>

          <ul className={css.list}>
            {statisticsConfig.map((item, index) => {
              const value =
                typeof item.value === "function"
                  ? item.value(totalProjects)
                  : item.value;
              return (
                <li key={index} className={css.item}>
                  <span
                    className={clsx(
                      item.isMain && css.headerAllProjectsNumbers,
                      !item.isMain && css.headerNumbers
                    )}
                  >
                    {value}
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
        <SearchInput value={search} onChange={handleSearchChange} />

        <div className={css.filterButtonsWrapper}>
          <div className={css.filterControls}>
            <button
              type="button"
              aria-label="Clear all filters"
              className={css.filterButton}
              onClick={handleClearFilters}
            >
              <img src="/filter.svg" alt="" width="16" height="18" />
            </button>

            <StatusFilter
              statusOrder={PROJECT_STATUS_ORDER}
              statusMap={statusMap}
              selectedStatus={status}
              onStatusChange={handleStatusChange}
              entityType="projects"
            />
          </div>

          <button
            type="button"
            className={css.createButton}
            onClick={() => {
              setIsModalOpen(true);
              setSelectedProject(null);
            }}
          >
            Create project
            <PlusIcon />
          </button>
        </div>
      </section>

      {isLoading && <Loader size="large" />}
      {isError && <div>{(error as Error).message}</div>}

      <ProjectTable
        projects={projects}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditClick}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
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
