import { useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { createProject, updateProject } from "@/api/projects";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import type { ProjectType, ProjectStatusType } from "@/types/Project";
import { statusMap } from "@/types/StatusMap";
import { PROJECT_STATUS_ORDER } from "@/features/projects/constants/projectStatusOrder";
import { useKeyboard } from "@/hooks/useKeyboard";
import { getButtonText } from "@/utils/modal";
import { handleAxiosError } from "@/utils/axiosError";
import css from "./ProjectModal.module.css";
import BackArrowIcon from "@/components/svg/BackArrowIcon";

type ProjectModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectType | null;
};

type ProjectModalFormDataType = {
  projectName: string;
  description: string;
  status: ProjectStatusType;
};

const ProjectModal = ({
  isOpen,
  onClose,
  project = null,
}: ProjectModalPropsType) => {
  const isEditing = !!project;
  const idPrefix = isEditing ? "edit-" : "";

  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<ProjectModalFormDataType>({
    mode: "onChange",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      projectName: project?.name || "",
      description: project?.description || "",
      status: (project?.status) as ProjectStatusType,
    });
  }, [project, reset]);

  const handleClose = useCallback(() => {
    reset({
      projectName: "",
      description: "",
    });
    clearErrors("root");
    onClose();
  }, [onClose, reset, clearErrors]);

  const onSubmit = async (data: ProjectModalFormDataType) => {
    clearErrors("root");

    try {
      if (isEditing) {
        await updateProject(project!.id, {
          name: data.projectName.trim(),
          description: data.description.trim() || undefined,
          status: data.status,
        });
      } else {
        await createProject({
          name: data.projectName.trim(),
          description: data.description.trim() || undefined,
          status: data.status,
        });
      }

      queryClient.invalidateQueries({
        queryKey: [PROJECT_QUERY_KEYS.projects],
      });
      handleClose();
    } catch (err) {
      const errorMessage = handleAxiosError(
        err,
        isEditing ? "Failed to update project" : "Failed to create project"
      );
      setError("root", {
        message: errorMessage,
      });
    }
  };

  useKeyboard(isOpen, handleClose);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={css.overlay} 
        onClick={isSubmitting ? undefined : handleClose} 
      />
      <div className={css.modal}>
        <div className={css.header}>
          <h2 className={css.title}>
            {isEditing ? "Edit project" : "Create project"}
          </h2>
          <button
            type="button"
            className={css.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <BackArrowIcon
              style={{
                transform: "scaleX(-1)",
                transformOrigin: "center",
              }}
            />
          </button>
        </div>

        <form onSubmit={handleFormSubmit(onSubmit)} className={css.form}>
          <div className={clsx(css.field, css.projectNameField)}>
            <label htmlFor={`${idPrefix}project-name`} className={css.label}>
              Project name
            </label>
            <input
              id={`${idPrefix}project-name`}
              type="text"
              className={css.input}
              {...register("projectName", {
                required: "Project name is required",
                validate: (value: string) =>
                  value.trim().length > 0 || "Project name cannot be empty",
              })}
              placeholder="Project name"
              disabled={isSubmitting}
            />
            {errors.projectName && (
              <div className={css.error}>{errors.projectName.message}</div>
            )}
          </div>

          <div className={clsx(css.field, css.descriptionField)}>
            <label htmlFor={`${idPrefix}description`} className={css.label}>
              Description
            </label>
            <textarea
              id={`${idPrefix}description`}
              className={css.textarea}
              {...register("description")}
              placeholder="Description"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className={clsx(css.field, css.statusField)}>
            <label className={css.label}>Status</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({
                field,
              }: {
                field: {
                  value: ProjectStatusType;
                  onChange: (value: ProjectStatusType) => void;
                };
              }) => (
                <div className={css.statusGrid}>
                  {PROJECT_STATUS_ORDER.map((statusOption) => {
                    const statusInfo = statusMap[statusOption];

                    if (!statusInfo) return null;

                    return (
                      <button
                        key={statusOption}
                        type="button"
                        className={clsx(
                          css.statusButton,
                          field.value === statusOption && css.statusButtonActive
                        )}
                        onClick={() => field.onChange(statusOption)}
                        disabled={isSubmitting}
                      >
                        {statusInfo.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.status && (
              <div className={css.error}>{errors.status.message}</div>
            )}
          </div>

          {errors.root?.message && (
            <div className={css.errorGeneral}>{errors.root.message}</div>
          )}

          <button
            type="submit"
            className={css.createButton}
            disabled={isSubmitting}
          >
            {getButtonText(isSubmitting, isEditing)}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProjectModal;
