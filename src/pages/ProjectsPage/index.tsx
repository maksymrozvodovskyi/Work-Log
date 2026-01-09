import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  createParser,
} from "nuqs";
import clsx from "clsx";
import { getProjects } from "@/api/projects";
import { useDebounce } from "@/hooks/useDebounce";
import { PROJECTS_QUERY_KEY } from "@/features/projects/queryKeys";
import type {
  SortField,
  SortDirection,
  ProjectStatus,
  Project,
} from "@/types/Project";
import { PROJECT_STATUS_ORDER } from "@/types/ProjectStatusOrder";
import css from "@/features/projects/index.module.css";
import ProjectTable from "@/features/projects/components/ProjectTable";
import SearchInput from "@/features/projects/components/SearchInput";
import StatusFilter from "@/features/projects/components/StatusFilter";
import Pagination from "@/features/projects/components/Pagination";
import Loader from "@/features/projects/components/Loader";
import ProjectModal from "@/features/projects/components/ProjectModal/ProjectModal";
import PlusIcon from "@/features/projects/svg/PlusIcon";

const PROJECTS_PER_PAGE = 10;

const parseAsSortField = createParser({
  parse: (value: string): SortField => {
    if (value === "name" || value === "status") {
      return value as SortField;
    }
    return "name";
  },
  serialize: (value: SortField) => value,
});

const parseAsSortDirection = createParser({
  parse: (value: string): SortDirection => {
    if (value === "asc" || value === "desc") {
      return value as SortDirection;
    }
    return "asc";
  },
  serialize: (value: SortDirection) => value,
});

const parseAsProjectStatus = createParser<ProjectStatus | null>({
  parse: (value: string | null): ProjectStatus | null => {
    if (!value) return null;
    if (PROJECT_STATUS_ORDER.includes(value as ProjectStatus)) {
      return value as ProjectStatus;
    }
    return null;
  },
  serialize: (value: ProjectStatus | null): string => value || "",
});

type StatisticItem = {
  value: number | ((totalProjects: number) => number);
  label: string;
  isMain?: boolean;
};

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

  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);

  const handleSearchChange = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleStatusChange = (newStatus: ProjectStatus | null) => {
    setFilters({ status: newStatus, page: 1 });
  };

  const {
    data: paginatedProjects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      PROJECTS_QUERY_KEY,
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
    setModalProject(project);
    setIsCreateModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalProject(null);
    setIsCreateModalOpen(false);
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
              selectedStatus={status}
              onStatusChange={handleStatusChange}
            />
          </div>

          <button
            type="button"
            className={css.createButton}
            onClick={() => {
              setIsCreateModalOpen(true);
              setModalProject(null);
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
        isOpen={isCreateModalOpen || modalProject !== null}
        project={modalProject}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ProjectsPage;
