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
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: "scaleX(-1)",
                transformOrigin: "center",
              }}
            >
              <path
                d="M6.75432 0.225549C6.60538 0.081141 6.40326 0 6.19251 0C5.98175 0 5.77964 0.081141 5.63069 0.225549L0.232895 5.44925C0.0837837 5.59349 0 5.78923 0 5.99334C0 6.19745 0.0837837 6.39319 0.232895 6.53744L5.63069 11.7611C5.82962 11.9636 6.12627 12.0455 6.40555 11.9753C6.68482 11.905 6.90277 11.6936 6.97482 11.423C7.04688 11.1524 6.9617 10.8652 6.75234 10.6729L1.91636 5.99334L6.75234 1.31374C6.90171 1.16975 6.98585 0.974153 6.98623 0.770043C6.9866 0.565932 6.90317 0.370051 6.75432 0.225549Z"
                fill="#F5F6FA"
              />
            </svg>
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
