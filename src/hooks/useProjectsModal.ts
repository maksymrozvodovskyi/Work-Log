import { useState, useCallback } from "react";

type UseProjectsModalOptionsType = {
  defaultDisplayText?: string;
  getDisplayText?: (count: number) => string;
};

export const useProjectsModal = (options?: UseProjectsModalOptionsType) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const saveProjects = useCallback((projectIds: Set<string>) => {
    setSelectedProjectIds(projectIds);
  }, []);

  const getDisplayText = useCallback(() => {
    if (selectedProjectIds.size === 0) {
      return options?.defaultDisplayText ?? "No projects";
    }
    if (options?.getDisplayText) {
      return options.getDisplayText(selectedProjectIds.size);
    }
    return `Selected ${selectedProjectIds.size}`;
  }, [selectedProjectIds, options]);

  return {
    isModalOpen,
    selectedProjectIds,
    openModal,
    closeModal,
    saveProjects,
    getDisplayText,
  };
};

