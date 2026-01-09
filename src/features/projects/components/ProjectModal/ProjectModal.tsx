import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { createProject, updateProject } from "../../../../api/projects";
import { PROJECTS_QUERY_KEY } from "../../queryKeys";
import type { Project, ProjectStatus } from "../../../../types/Project";
import { statusMap } from "../../../../types/StatusMap";
import { PROJECT_STATUS_ORDER } from "../../../../types/ProjectStatusOrder";
import ArrowRightIcon from "../../svg/ArrowRightIcon";
import css from "./ProjectModal.module.css";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

interface FormData {
  projectName: string;
  description: string;
  status: ProjectStatus;
}

const ProjectModal = ({
  isOpen,
  onClose,
  project = null,
}: ProjectModalProps) => {
  const isEditing = !!project;

  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      projectName: project?.name || "",
      description: project?.description || "",
      status: (project?.status || "PLANNED") as ProjectStatus,
    });
  }, [project, reset]);

  const handleClose = useCallback(() => {
    reset({
      projectName: project?.name || "",
      description: project?.description || "",
      status: (project?.status || "PLANNED") as ProjectStatus,
    });
    setError(null);
    onClose();
  }, [onClose, project, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && project) {
        await updateProject(project.id, {
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

      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
          ? "Failed to update project"
          : "Failed to create project"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const idPrefix = isEditing ? "edit-" : "";

  return (
    <>
      <div className={css.overlay} onClick={handleClose} />
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
          >
            <ArrowRightIcon />
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
                  value: ProjectStatus;
                  onChange: (value: ProjectStatus) => void;
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

          {error && <div className={css.errorGeneral}>{error}</div>}

          <button
            type="submit"
            className={css.createButton}
            disabled={isLoading}
          >
            {isLoading
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
              ? "Save"
              : "Create"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProjectModal;
