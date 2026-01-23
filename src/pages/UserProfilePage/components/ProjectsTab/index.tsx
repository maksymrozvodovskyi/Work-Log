import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { getUserProjects } from "@/api/users";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useProjectSorting } from "@/hooks/useProjectSorting";
import { formatDateDisplay } from "@/utils/dateUtils";
import SearchInput from "@/features/projects/components/SearchInput";
import Loader from "@/features/projects/components/Loader";
import ToggleSwitch from "@/components/ToggleSwitch";
import InviteToProjectModal from "./components/InviteToProjectModal";
import css from "./ProjectsTab.module.css";

const ProjectsTab = () => {
  const { id: userId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { sortField, sortDirection, handleSortChange } = useProjectSorting();
  const [search, setSearch] = useState("");
  const [uiState, setUiState] = useState({
    isSortDropdownOpen: false,
    isInviteModalOpen: false,
  });
  const [projectToggles, setProjectToggles] = useState<Record<string, boolean>>({});
  const debouncedSearch = useDebounce(search, 500);

  const toggleSortDropdown = () =>
    setUiState((prev) => ({ ...prev, isSortDropdownOpen: !prev.isSortDropdownOpen }));
  const closeSortDropdown = () =>
    setUiState((prev) => ({ ...prev, isSortDropdownOpen: false }));
  const openInviteModal = () =>
    setUiState((prev) => ({ ...prev, isInviteModalOpen: true }));
  const closeInviteModal = () =>
    setUiState((prev) => ({ ...prev, isInviteModalOpen: false }));

  const sortDropdownRef = useClickOutside<HTMLDivElement>(() => {
    if (uiState.isSortDropdownOpen) closeSortDropdown();
  }, uiState.isSortDropdownOpen);

  const { data: paginatedProjects, isLoading, isError } = useQuery({
    queryKey: USER_QUERY_KEYS.userProjects(
      userId,
      debouncedSearch || undefined,
      sortField,
      sortDirection
    ),
    queryFn: () =>
      getUserProjects(userId!, {
        search: debouncedSearch || undefined,
        sortField,
        sortDirection,
      }),
    enabled: !!userId,
  });

  const projects = paginatedProjects?.data ?? [];

  if (isLoading) {
    return (
      <div className={css.loaderWrapper}>
        <Loader size="medium" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.errorWrapper}>
        <span className={css.errorText}>Error loading projects</span>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <SearchInput value={search} onChange={setSearch} />
        <div className={css.headerButtons}>
          <div className={css.sortButtonWrapper} ref={sortDropdownRef}>
            <button
              type="button"
              className={css.sortButton}
              onClick={toggleSortDropdown}
            >
              Sort by {sortField === "name" ? "name" : "status"}
              <svg
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={clsx(
                  css.arrowIcon,
                  uiState.isSortDropdownOpen && css.arrowIconOpen
                )}
              >
                <path
                  d="M6.75432 0.225549C6.60538 0.081141 6.40326 0 6.19251 0C5.98175 0 5.77964 0.081141 5.63069 0.225549L0.232895 5.44925C0.0837837 5.59349 0 5.78923 0 5.99334C0 6.19745 0.0837837 6.39319 0.232895 6.53744L5.63069 11.7611C5.82962 11.9636 6.12627 12.0455 6.40555 11.9753C6.68482 11.905 6.90277 11.6936 6.97482 11.423C7.04688 11.1524 6.9617 10.8652 6.75234 10.6729L1.91636 5.99334L6.75234 1.31374C6.90171 1.16975 6.98585 0.974153 6.98623 0.770043C6.9866 0.565932 6.90317 0.370051 6.75432 0.225549Z"
                  fill="#8b97a3"
                />
              </svg>
            </button>
            {uiState.isSortDropdownOpen && (
              <div className={css.sortDropdown}>
                <button
                  type="button"
                  className={css.dropdownItem}
                  onClick={() => {
                    handleSortChange("name");
                    closeSortDropdown();
                  }}
                >
                  By name
                </button>
                <button
                  type="button"
                  className={css.dropdownItem}
                  onClick={() => {
                    handleSortChange("status");
                    closeSortDropdown();
                  }}
                >
                  By status
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className={css.inviteButton}
            onClick={openInviteModal}
          >
            Invite to project
          </button>
        </div>
      </div>

      {projects.length > 0 && (
        <div className={css.projectsGrid}>
          {projects.map((project) => (
            <div key={project.id} className={css.projectCard}>
              <div className={css.projectContent}>
                <span className={css.projectName}>{project.name}</span>
                {project.createdAt && (
                  <span className={css.projectDate}>
                    {formatDateDisplay(new Date(project.createdAt))}
                  </span>
                )}
              </div>
              <ToggleSwitch
                checked={projectToggles[project.id] || false}
                onChange={(checked) =>
                  setProjectToggles((prev) => ({
                    ...prev,
                    [project.id]: checked,
                  }))
                }
                ariaLabel={`Toggle project ${project.name}`}
              />
            </div>
          ))}
        </div>
      )}

      {projects.length === 0 && (
        <div className={css.emptyState}>
          <span className={css.emptyText}>No projects found</span>
        </div>
      )}

      <InviteToProjectModal
        isOpen={uiState.isInviteModalOpen}
        onClose={closeInviteModal}
        userId={userId!}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: USER_QUERY_KEYS.userProjects(userId),
          });
        }}
      />
    </div>
  );
};

export default ProjectsTab;
