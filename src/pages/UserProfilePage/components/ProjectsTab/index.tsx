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
import SearchInput from "@/components/SearchInput";
import Loader from "@/components/Loader";
import ToggleSwitch from "@/components/ToggleSwitch";
import BackArrowIcon from "@/components/svg/BackArrowIcon";
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
              <BackArrowIcon
                className={clsx(
                  css.arrowIcon,
                  uiState.isSortDropdownOpen && css.arrowIconOpen
                )}
                fill="#8b97a3"
              />
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
