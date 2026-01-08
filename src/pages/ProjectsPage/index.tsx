import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/projects/projects";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  SortField,
  SortDirection,
  ProjectStatus,
  Project,
} from "@/types/project";
import css from "@/features/projects/index.module.css";
import ProjectTable from "@/features/projects/components/projectTable";
import SearchInput from "@/features/projects/components/searchInput";
import StatusFilter from "@/features/projects/components/statusFilter";
import Pagination from "@/features/projects/components/pagination";
import Loader from "@/features/projects/components/loader";
import CreateProjectModal from "@/features/projects/components/createProjectModal";
import EditProjectModal from "@/features/projects/components/editProjectModal";

const PROJECTS_PER_PAGE = 10;

const ProjectsPage = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    null
  );

  const debouncedSearchTerm = useDebounce(globalFilter, 500);

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: ProjectStatus | null) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const {
    data: paginatedProjects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "projects",
      debouncedSearchTerm,
      sortField,
      sortDirection,
      currentPage,
      selectedStatus,
    ],
    queryFn: () =>
      getProjects({
        search: debouncedSearchTerm || undefined,
        sortField,
        sortDirection,
        skip: (currentPage - 1) * PROJECTS_PER_PAGE,
        take: PROJECTS_PER_PAGE,
        status: selectedStatus || undefined,
      }),
  });

  const projects = paginatedProjects?.data ?? [];
  const totalProjects = paginatedProjects?.total ?? 0;
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
  };

  const handleCloseEditModal = () => {
    setEditingProject(null);
  };

  const handleClearFilters = () => {
    setGlobalFilter("");
    setSelectedStatus(null);
    setSortField("name");
    setSortDirection("asc");
    setCurrentPage(1);
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
            <li className={css.item}>
              <span className={css.headerAllProjectsNumbers}>
                {totalProjects}
              </span>
              <span className={css.headerAllProjects}>All projects</span>
            </li>
            <li className={css.item}>
              <span className={css.headerNumbers}>100</span>
              <span className={css.headerText}>Time & material</span>
            </li>
            <li className={css.item}>
              <span className={css.headerNumbers}>56</span>
              <span className={css.headerText}>Fixed time</span>
            </li>
            <li className={css.item}>
              <span className={css.headerNumbers}>5</span>
              <span className={css.headerText}>Archived</span>
            </li>
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
        <SearchInput value={globalFilter ?? ""} onChange={handleSearchChange} />

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
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
          </div>

          <button
            type="button"
            className={css.createButton}
            onClick={() => setIsModalOpen(true)}
          >
            Create project
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1V11M1 6H11"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {isLoading && <Loader size="large" />}
      {isError && <div>{(error as Error).message}</div>}

      <ProjectTable
        projects={projects}
        isError={isError}
        error={error}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditClick}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditProjectModal
        isOpen={editingProject !== null}
        project={editingProject}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default ProjectsPage;
