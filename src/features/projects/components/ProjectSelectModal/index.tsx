import SelectModal from "../SelectModal";
import { useProjectSearch } from "@/hooks/useProjectSearch";
import type { ProjectType } from "@/types/Project";

export type ProjectSelectModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  selectedProjectId: string | null;
  onSelect: (project: ProjectType | null) => void;
};

const ProjectSelectModal = (props: ProjectSelectModalPropsType) => {
  return (
    <SelectModal
      {...props}
      selectedId={props.selectedProjectId}
      title="Select projects"
      placeholder="Search by title"
      searchAriaLabel="Search projects"
      emptyMessage="No projects"
      errorMessage="Failed to load projects"
      useSearch={useProjectSearch}
    />
  );
};

export default ProjectSelectModal;

