import { useState, useCallback } from "react";
import { useProjectSearch } from "@/hooks/useProjectSearch";
import { useInviteUsers } from "@/hooks/useInviteUsers";
import { handleAxiosError } from "@/utils/axiosError";
import BaseModal from "@/components/BaseModal";
import SearchIcon from "@/components/svg/SearchIcon";
import CloseIcon from "@/components/svg/CloseIcon";
import ToggleSwitch from "@/components/ToggleSwitch";
import ArrowIcon from "@/components/svg/ArrowIcon";
import Loader from "@/components/Loader";
import css from "./InviteToProjectModal.module.css";

type InviteToProjectModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
};

const InviteToProjectModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: InviteToProjectModalPropsType) => {
  const [search, setSearch] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );
  const [inviteError, setInviteError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setSearch("");
    setSelectedProjects(new Set());
    setInviteError(null);
    onClose();
  }, [onClose]);

  const { items: projects, isLoading, isError, error } = useProjectSearch({
    searchTerm: search,
    isEnabled: isOpen,
  });

  const { inviteUsersToProjects, isInviting } = useInviteUsers({
    userId,
    onSuccess: () => {
      if (onSuccess) onSuccess();
      handleClose();
    },
    onClose: handleClose,
  });

  const handleToggle = (projectId: string, checked: boolean) => {
    setSelectedProjects((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(projectId);
      } else {
        newSet.delete(projectId);
      }
      return newSet;
    });
  };

  const handleInvite = async () => {
    if (selectedProjects.size === 0) return;
    setInviteError(null);
    try {
      await inviteUsersToProjects(selectedProjects);
    } catch (error) {
      const errorMessage = handleAxiosError(
        error,
        "Failed to invite user to projects"
      );
      setInviteError(errorMessage);
    }
  };

  const handleClear = () => {
    setSearch("");
  };

  const areAllVisibleProjectsSelected = useCallback(() => {
    if (projects.length === 0) return false;
    return projects.every((project) => selectedProjects.has(project.id));
  }, [projects, selectedProjects]);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedProjects((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        projects.forEach((project) => {
          newSet.add(project.id);
        });
      } else {
        projects.forEach((project) => {
          newSet.delete(project.id);
        });
      }
      return newSet;
    });
  }, [projects]);

  const headerContent = (
    <div className={css.header}>
      <h2 className={css.title}>Select sub technologies</h2>
      <div className={css.headerButtons}>
        <button
          type="button"
          className={css.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <ArrowIcon
            fill="#F5F6FA"
            style={{
              width: "7px",
              height: "12px",
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </button>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      headerContent={headerContent}
      width="336px"
    >
      <div className={css.content}>
        <div className={css.searchSection}>
          <div className={css.searchInputWrapper}>
            <SearchIcon />
            <input
              type="text"
              className={css.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              aria-label="Search technologies by name"
            />
            {search && (
              <button
                type="button"
                onClick={handleClear}
                className={css.clearButton}
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>
          <div className={css.divider}></div>
          <div className={css.counter}>
            Selected {selectedProjects.size} / {projects.length}
          </div>
        </div>

        {isLoading && (
          <div className={css.loaderWrapper}>
            <Loader size="medium" inline />
          </div>
        )}

        {isError && !isLoading && (
          <div className={css.errorWrapper}>
            <span className={css.errorText}>
              {handleAxiosError(
                error,
                "Error loading projects"
              )}
            </span>
          </div>
        )}

        {!isLoading && !isError && (
          <ul className={css.projectsList}>
            {projects.length > 0 && (
              <li className={css.projectItem}>
                <span className={css.projectName}>Select all</span>
                <ToggleSwitch
                  checked={areAllVisibleProjectsSelected()}
                  onChange={handleSelectAll}
                  ariaLabel="Select all projects"
                />
              </li>
            )}
            {projects.length > 0 &&
              projects.map((project) => (
                <li key={project.id} className={css.projectItem}>
                  <span className={css.projectName}>{project.name}</span>
                  <ToggleSwitch
                    checked={selectedProjects.has(project.id)}
                    onChange={(checked) => handleToggle(project.id, checked)}
                    ariaLabel={`Toggle ${project.name}`}
                  />
                </li>
              ))}
            {projects.length === 0 && (
              <li className={css.emptyState}>
                <span className={css.emptyText}>No projects found</span>
              </li>
            )}
          </ul>
        )}

        {selectedProjects.size > 0 && (
          <div className={css.footer}>
            {inviteError && (
              <div className={css.errorWrapper} style={{ padding: "0 0 12px 0", minHeight: "auto" }}>
                <span className={css.errorText} style={{ color: "#fc7141" }}>
                  {inviteError}
                </span>
              </div>
            )}
            <button
              type="button"
              className={css.inviteButton}
              onClick={handleInvite}
              disabled={isInviting}
            >
              Invite to {selectedProjects.size}{" "}
              {selectedProjects.size === 1 ? "project" : "projects"}
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default InviteToProjectModal;

