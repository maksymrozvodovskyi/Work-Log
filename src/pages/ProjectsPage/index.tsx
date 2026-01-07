import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../api/projects/projects";
import { useDebounce } from "../../hooks/useDebounce";
import type { SortField, SortDirection } from "../../types/project";
import css from "../../features/projects/index.module.css";
import ProjectTable from "../../features/projects/components/projectTable";
import SearchInput from "../../features/projects/components/searchInput";
import StatusFilter from "../../features/projects/components/statusFilter";
import Pagination from "../../features/projects/components/pagination";
import Loader from "../../features/projects/components/loader";

const PROJECTS_PER_PAGE = 10;

const ProjectsPage = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(globalFilter, 500);

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
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
    ],
    queryFn: () =>
      getProjects({
        search: debouncedSearchTerm || undefined,
        sortField,
        sortDirection,
        skip: (currentPage - 1) * PROJECTS_PER_PAGE,
        take: PROJECTS_PER_PAGE,
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.28518 0.00676828L8.99323 0L8.69191 0.00733561C7.02062 0.0800575 5.4568 0.75435 4.22976 1.93922C2.86496 3.25712 2.11617 5.03606 2.11617 6.94947V9.54023L2.10891 9.67381C2.06569 10.0701 1.8318 10.4222 1.47658 10.6132C0.567559 11.0989 0 12.0468 0 13.0837V14.4669L0.00594434 14.566L0.0254505 14.6702C0.112182 15.0095 0.411145 15.263 0.775996 15.263L5.58685 15.2622L5.61357 15.3754L5.66637 15.556C6.1256 16.9836 7.45891 18 9 18L9.18435 17.9951L9.37399 17.9799C10.8178 17.824 12.0208 16.7762 12.3874 15.3745L12.4131 15.2622L17.224 15.263L17.3226 15.2567C17.7093 15.2072 18 14.8694 18 14.4669V13.0837L17.9934 12.8908C17.928 11.9321 17.3776 11.0717 16.5232 10.6131C16.1273 10.4002 15.8838 9.99247 15.8838 9.54023L15.8839 7.92212C15.597 7.97329 15.3016 8 15 8C14.7677 8 14.5392 7.98416 14.3153 7.95351L14.3152 9.54023L14.3218 9.73318C14.3873 10.6918 14.9376 11.5523 15.792 12.0109L15.9061 12.0804C16.2342 12.3057 16.4314 12.6767 16.4314 13.0837L16.4311 13.6781H1.57662L1.57689 13.0837L1.58414 12.9501C1.62737 12.5538 1.86126 12.2018 2.21648 12.0108C3.1255 11.525 3.69306 10.5772 3.69306 9.54023V6.94947L3.69978 6.67352C3.76693 5.30075 4.335 4.03714 5.32259 3.07968C6.37874 2.05973 7.76275 1.53084 9.22485 1.59021C9.5451 1.60307 9.8599 1.64471 10.1665 1.71566C10.3066 1.18681 10.5313 0.692347 10.8262 0.246216C10.3285 0.108396 9.81207 0.0273247 9.28518 0.00676828ZM7.24359 15.2622H10.7642L10.7254 15.3493C10.4053 15.992 9.75039 16.4161 9.00415 16.4161L8.84573 16.4097C8.16606 16.3544 7.58012 15.9461 7.28288 15.3493L7.24359 15.2622Z"
                fill="#AEB8C2"
              />
            </svg>
            <div className={css.notificationBadge}>
              <svg
                width="7"
                height="7"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 0C5.433 0 7 1.567 7 3.5C7 5.433 5.433 7 3.5 7C1.567 7 0 5.433 0 3.5C0 1.567 1.567 0 3.5 0Z"
                  fill="#6b7682"
                />
              </svg>
            </div>
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
              aria-label="Filter projects"
              className={css.filterButton}
            >
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3H14L12 7H4L2 3Z"
                  stroke="#AEB8C2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M6 7V13M10 7V13"
                  stroke="#AEB8C2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="13"
                  y1="2"
                  x2="3"
                  y2="14"
                  stroke="#AEB8C2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <StatusFilter />
          </div>

          <button type="button" className={css.createButton}>
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
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProjectsPage;
