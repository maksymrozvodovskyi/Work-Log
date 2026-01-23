import { useEffect, Activity, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import BaseModal from "@/components/BaseModal";
import SearchInput from "@/components/SearchInput";
import ToggleSwitch from "@/components/ToggleSwitch";
import ArrowIcon from "@/components/svg/ArrowIcon";
import { useProjectSelection } from "@/hooks/useProjectSelection";
import { useProjectSearch } from "@/hooks/useProjectSearch";
import { useInviteUsers } from "@/hooks/useInviteUsers";
import css from "./ProjectsSelectModal.module.css";

type ProjectsSelectModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  selectedProjectIds: Set<string>;
  onSave: (projectIds: Set<string>) => void;
  userId: string;
};

type FormDataType = {
  searchTerm: string;
  selectedProjects: Record<string, boolean>;
};

const ProjectsSelectModal = ({
  isOpen,
  onClose,
  selectedProjectIds,
  onSave,
  userId,
}: ProjectsSelectModalPropsType) => {
  const {
    control,
    setValue,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormDataType>({
    defaultValues: {
      searchTerm: "",
      selectedProjects: {},
    },
  });

  const searchTerm = useWatch({ control, name: "searchTerm" });
  const selectedProjectsRaw = useWatch({ control, name: "selectedProjects" });
  const selectedProjects = selectedProjectsRaw || {};

  const { projects, totalProjects, isLoading, isError, error } = useProjectSearch({
    searchTerm,
    isEnabled: isOpen,
  });

  const {
    selectedIdsSet,
    selectedCount,
    allFilteredSelected,
    handleToggleProject,
    handleToggleAll,
    createInitialSelectedProjects,
  } = useProjectSelection({
    projects,
    selectedProjects,
    setValue,
  });

  const { inviteUsersToProjects, isInviting } = useInviteUsers({
    userId,
    onSuccess: onSave,
    onClose,
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        searchTerm: "",
        selectedProjects: createInitialSelectedProjects(selectedProjectIds),
      });
      clearErrors("root");
    }
  }, [isOpen, selectedProjectIds, reset, clearErrors, createInitialSelectedProjects]);

  const handleInviteClick = async () => {
    if (selectedCount === 0) return;

    clearErrors("root");

    try {
      await inviteUsersToProjects(selectedIdsSet);
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to invite user to projects",
      });
    }
  };

  const handleClose = useCallback(() => {
    reset({
      searchTerm: "",
      selectedProjects: createInitialSelectedProjects(selectedProjectIds),
    });
    clearErrors("root");
    onClose();
  }, [onClose, selectedProjectIds, reset, clearErrors, createInitialSelectedProjects]);

  const headerContent = (
    <div className={css.header}>
      <div className={css.headerLeft}>
        <h2 className={css.title}>Invite to project</h2>
        <button
          type="button"
          className={css.nextButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <ArrowIcon
            fill="#F5F6FA"
            style={{
              width: "12px",
              height: "8px",
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
    >
      <div className={css.content}>
          <div className={css.searchSection}>
            <SearchInput
              value={searchTerm}
              onChange={(value) => setValue("searchTerm", value)}
              placeholder="Search by projects"
              ariaLabel="Search projects"
            />
          </div>

          <div className={css.selectedCounter}>
            Invited to {selectedCount} / {totalProjects}
          </div>

          <div className={css.projectsList}>
            <Activity mode={isLoading ? "visible" : "hidden"}>
              <div className={css.loading}>Loading projects...</div>
            </Activity>

            <Activity mode={isError ? "visible" : "hidden"}>
              <div className={css.emptyState}>
                <div className={css.emptyStateBox}>
                  {error instanceof Error ? error.message : "Failed to load projects"}
                </div>
              </div>
            </Activity>

            {projects.length === 0 && (
              <div className={css.emptyState}>
                <div className={css.emptyStateBox}>No projects</div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <>
                <div className={css.projectItem}>
                  <span className={css.projectName}>Select all</span>
                  <ToggleSwitch
                    checked={allFilteredSelected}
                    onChange={handleToggleAll}
                    ariaLabel="Select all projects"
                  />
                </div>
                {projects.map((project) => (
                  <div key={project.id} className={css.projectItem}>
                    <span className={css.projectName}>{project.name}</span>
                    <ToggleSwitch
                      checked={!!selectedProjects[project.id]}
                      onChange={(checked) => handleToggleProject(project.id, checked)}
                      ariaLabel={`Toggle ${project.name} project`}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
          
          <Activity mode={errors.root?.message ? "visible" : "hidden"}>
            <div className={css.errorMessage}>
              {errors.root?.message}
            </div>
          </Activity>
          {selectedCount > 0 && (
            <button
              type="button"
              className={css.notification}
              onClick={handleInviteClick}
              disabled={isInviting}
            >
              {isInviting ? "Inviting..." : `Invite to ${selectedCount} ${selectedCount === 1 ? "project" : "projects"}`}
            </button>
          )}
        </div>
    </BaseModal>
  );
};

export default ProjectsSelectModal;

