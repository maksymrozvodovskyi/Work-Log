import { useState, useMemo, Activity } from "react";
import { differenceInHours, endOfDay, parseISO, format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import BaseModal from "@/components/BaseModal";
import PlusIcon from "@/components/svg/PlusIcon";
import BackArrowIcon from "@/components/svg/BackArrowIcon";
import ProjectSelectModal from "@/features/projects/components/ProjectSelectModal";
import UserSelectModal from "@/features/projects/components/UserSelectModal";
import { addUserToProject } from "@/api/projects";
import { handleAxiosError } from "@/utils/axiosError";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import type { ProjectType } from "@/types/Project";
import type { ApiUserType } from "@/utils/userTransformers";
import css from "./CreateTimelineModal.module.css";

type CreateTimelineModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
};

const MODAL_TYPES = {
  PROJECT: 'project',
  USER: 'user',
} as const;

type ActiveModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES] | null;

const CreateTimelineModal = ({
  isOpen,
  onClose,
}: CreateTimelineModalPropsType) => {
  const queryClient = useQueryClient();

  const createTimelineMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      addUserToProject(projectId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PROJECT_QUERY_KEYS.projects],
        exact: false,
        refetchType: 'active',
      });

      await queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEYS.users],
        exact: false,
        refetchType: 'active',
      });

      await queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.userProjects(selectedUser!.id),
        exact: false,
        refetchType: 'active',
      });

      handleClose();
    },
  });

  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [selectedUser, setSelectedUser] = useState<ApiUserType | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

  const periodData = useMemo(() => {
    if (!selectedProject) {
      return null;
    }

    const startDate = parseISO(selectedProject.createdAt);
    const endDate = selectedProject.endDate ? parseISO(selectedProject.endDate) : new Date();
    
    const formattedStartDate = format(startDate, "dd.MM.yyyy");
    const formattedEndDate = selectedProject.endDate ? format(parseISO(selectedProject.endDate), "dd.MM.yyyy") : null;
    
    const endOfPeriod = endOfDay(endDate);
    const hours = differenceInHours(endOfPeriod, startDate);
    const formattedHours = hours > 0 ? `${hours} hours` : "0 hours";

    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      hours: formattedHours,
    };
  }, [selectedProject]);

  const handleClose = () => {
    setSelectedProject(null);
    setSelectedUser(null);
    setActiveModal(null);
    onClose();
  };

  const handleProjectSelect = (project: ProjectType | null) => {
    setSelectedProject(project);
  };

  const handleUserSelect = (user: ApiUserType | null) => {
    setSelectedUser(user);
  };

  const handleCreateTimeline = () => {
    if (!selectedProject || !selectedUser) {
      return;
    }

    createTimelineMutation.mutate({
      projectId: selectedProject.id,
      userId: selectedUser.id,
    });
  };

  const headerContent = (
    <div className={css.header}>
      <h2 className={css.title}>Create timeline</h2>
      <button
        type="button"
        className={css.closeButton}
        onClick={handleClose}
        aria-label="Close modal"
      >
        <BackArrowIcon
          style={{
            transform: "scaleX(-1)",
            transformOrigin: "center",
          }}
        />
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      headerContent={headerContent}
      width="336px"
      usePortal={false}
    >
      <div className={css.content}>
        <div className={clsx(css.field, selectedProject && css.projectField)}>
          <Activity mode={selectedProject ? "visible" : "hidden"}>
            <>
              <label className={css.label}>Project</label>
              <input
                type="text"
                className={css.selectedProjectInput}
                value={selectedProject?.name || ""}
                readOnly
                onClick={() => setActiveModal(MODAL_TYPES.PROJECT)}
              />
            </>
          </Activity>
          
          <Activity mode={!selectedProject ? "visible" : "hidden"}>
            <div className={css.fieldRow}>
              <label className={css.label}>Project</label>
              <button
                type="button"
                className={css.addButton}
                onClick={() => setActiveModal(MODAL_TYPES.PROJECT)}
              >
                Add
                <span className={css.plusIconWrapper}>
                  <PlusIcon stroke="#fff" />
                </span>
              </button>
            </div>
          </Activity>
        </div>

        <div className={clsx(css.field, selectedUser && css.employeeField)}>
          <Activity mode={selectedUser ? "visible" : "hidden"}>
            <>
              <label className={css.label}>Employee</label>
              <input
                type="text"
                className={css.selectedEmployeeInput}
                value={selectedUser?.name || ""}
                readOnly
                onClick={() => setActiveModal(MODAL_TYPES.USER)}
              />
            </>
          </Activity>
          
          <Activity mode={!selectedUser ? "visible" : "hidden"}>
            <div className={css.fieldRow}>
              <label className={css.label}>Employee</label>
              <button
                type="button"
                className={css.addButton}
                onClick={() => setActiveModal(MODAL_TYPES.USER)}
              >
                Add
                <span className={css.plusIconWrapper}>
                  <PlusIcon stroke="#fff" />
                </span>
              </button>
            </div>
          </Activity>
        </div>

        <div className={clsx(css.field, css.periodField)}>
          <div className={css.periodHeader}>
            <label className={css.label}>Period</label>
            {periodData?.endDate && (
              <span className={css.endsOnText}>ends on {periodData.endDate}</span>
            )}
          </div>
          <div className={css.periodWrapper}>
            <input
              type="text"
              className={css.periodInput}
              value={periodData?.startDate || ""}
              placeholder="Type start day"
              readOnly
            />
            <span className={css.dash}></span>
            <input
              type="text"
              className={css.periodInput}
              value={periodData?.hours || ""}
              placeholder="Hours"
              readOnly
            />
          </div>
        </div>

        <Activity mode={createTimelineMutation.error ? "visible" : "hidden"}>
          <div className={css.error}>
            {createTimelineMutation.error
              ? handleAxiosError(
                  createTimelineMutation.error,
                  "Failed to invite user to project"
                )
              : null}
          </div>
        </Activity>
        <button
          type="button"
          className={css.createButton}
          onClick={handleCreateTimeline}
          disabled={createTimelineMutation.isPending || !selectedProject || !selectedUser}
        >
          {createTimelineMutation.isPending ? "Creating..." : "Create timeline"}
        </button>
      </div>

      <ProjectSelectModal
        isOpen={activeModal === MODAL_TYPES.PROJECT}
        onClose={() => setActiveModal(null)}
        selectedProjectId={selectedProject?.id || null}
        onSelect={handleProjectSelect}
      />

      <UserSelectModal
        isOpen={activeModal === MODAL_TYPES.USER}
        onClose={() => setActiveModal(null)}
        selectedUserId={selectedUser?.id || null}
        onSelect={handleUserSelect}
      />
    </BaseModal>
  );
};

export default CreateTimelineModal;

