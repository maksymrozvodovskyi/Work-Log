import { getProjects } from "@/api/projects";
import { useItemSearch } from "@/features/projects/hooks/useItemSearch";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import type { ProjectType } from "@/types/Project";

type UseProjectSearchPropsType = {
  searchTerm: string;
  isEnabled?: boolean;
};

export const useProjectSearch = ({
  searchTerm,
  isEnabled = true,
}: UseProjectSearchPropsType) => {
  return useItemSearch<ProjectType>({
    searchTerm,
    isEnabled,
    queryKey: [PROJECT_QUERY_KEYS.projects],
    queryFn: (search) => getProjects({ search: search || undefined }),
  });
};
