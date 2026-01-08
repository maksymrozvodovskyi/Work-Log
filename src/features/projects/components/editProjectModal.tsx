import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../../../api/projects/projects";
import type { Project, ProjectStatus } from "../../../types/project";
import { statusMap } from "../../../types/statusMap";
import css from "./createProjectModal.module.css";

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

const EditProjectModal = ({
  isOpen,
  project,
  onClose,
}: EditProjectModalProps) => {
  const statusOptions: ProjectStatus[] = [
    "PLANNED",
    "INPROGRESS",
    "ONHOLD",
    "COMPLETED",
    "CANCELLED",
    "SUPPORT",
  ];

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("PLANNED");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setDescription(project.description || "");
      setStatus(project.status);
    }
  }, [project]);

  const handleClose = useCallback(() => {
    if (project) {
      setProjectName(project.name);
      setDescription(project.description || "");
      setStatus(project.status);
    }
    setError(null);

    onClose();
  }, [onClose, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !project) return;

    setIsLoading(true);

    setError(null);

    try {
      await updateProject(project.id, {
        name: projectName.trim(),
        description: description.trim() || undefined,
        status,
      });

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
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

  if (!isOpen || !project) return null;

  return (
    <>
      <div className={css.overlay} onClick={handleClose} />
      <div className={css.modal}>
        <div className={css.header}>
          <h2 className={css.title}>Edit project</h2>
          <button
            type="button"
            className={css.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.245678 0.225549C0.394623 0.081141 0.596736 0 0.807493 0C1.01825 0 1.22036 0.081141 1.36931 0.225549L6.76711 5.44925C6.91622 5.59349 7 5.78923 7 5.99334C7 6.19745 6.91622 6.39319 6.76711 6.53744L1.36931 11.7611C1.17038 11.9636 0.873728 12.0455 0.594452 11.9753C0.315176 11.905 0.0972313 11.6936 0.0251775 11.423C-0.0468763 11.1524 0.0383015 10.8652 0.247663 10.6729L5.08364 5.99334L0.247663 1.31374C0.0982884 1.16975 0.0141475 0.974153 0.0137751 0.770043C0.0134027 0.565932 0.0968295 0.370051 0.245678 0.225549Z"
                fill="#F5F6FA"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={css.form}>
          <div className={`${css.field} ${css.projectNameField}`}>
            <label htmlFor="edit-project-name" className={css.label}>
              Project name
            </label>
            <input
              id="edit-project-name"
              type="text"
              className={css.input}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              required
            />
          </div>

          <div className={`${css.field} ${css.descriptionField}`}>
            <label htmlFor="edit-description" className={css.label}>
              Description
            </label>
            <textarea
              id="edit-description"
              className={css.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={4}
            />
          </div>

          <div className={`${css.field} ${css.statusField}`}>
            <label className={css.label}>Status</label>
            <div className={css.statusGrid}>
              {statusOptions.map((statusOption) => {
                const statusInfo = statusMap[statusOption];

                if (!statusInfo) return null;

                return (
                  <button
                    key={statusOption}
                    type="button"
                    className={`${css.statusButton} ${
                      status === statusOption ? css.statusButtonActive : ""
                    }`}
                    onClick={() => setStatus(statusOption)}
                  >
                    {statusInfo.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{ color: "#fc7141", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={css.createButton}
            disabled={isLoading || !projectName.trim()}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProjectModal;
