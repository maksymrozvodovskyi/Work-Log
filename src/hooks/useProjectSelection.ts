import { useCallback, useMemo } from "react";
import type { UseFormSetValue } from "react-hook-form";

type FormDataType = {
  searchTerm: string;
  selectedProjects: Record<string, boolean>;
};

type ProjectSelectionProjectType = {
  id: string;
  name: string;
};

type UseProjectSelectionPropsType = {
  projects: ProjectSelectionProjectType[];
  selectedProjects: Record<string, boolean>;
  setValue: UseFormSetValue<FormDataType>;
};

export const useProjectSelection = ({
  projects,
  selectedProjects,
  setValue,
}: UseProjectSelectionPropsType) => {
  const createInitialSelectedProjects = useCallback((ids: Set<string>): Record<string, boolean> =>
    Object.fromEntries(Array.from(ids).map((id) => [id, true])), []);

  const selectedIdsSet = useMemo(() => {
    const set = new Set<string>();
    Object.entries(selectedProjects).forEach(([id, selected]) => {
      if (selected) set.add(id);
    });
    return set;
  }, [selectedProjects]);

  const selectedCount = selectedIdsSet.size;

  const allFilteredSelected = useMemo(() => {
    return projects && projects.length > 0 && projects.every((project) => selectedProjects[project.id]);
  }, [projects, selectedProjects]);

  const handleToggleProject = useCallback(
    (projectId: string, checked: boolean) => {
      setValue(`selectedProjects.${projectId}`, checked, { shouldDirty: true });
    },
    [setValue]
  );

  const handleToggleAll = useCallback(() => {
    const newValue = !allFilteredSelected;
    projects?.forEach((project) => {
      setValue(`selectedProjects.${project.id}`, newValue, { shouldDirty: true });
    });
  }, [allFilteredSelected, projects, setValue]);

  return {
    selectedIdsSet,
    selectedCount,
    allFilteredSelected,
    handleToggleProject,
    handleToggleAll,
    createInitialSelectedProjects,
  };
};
