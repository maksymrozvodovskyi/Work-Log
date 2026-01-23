import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/projects";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";

type UseProjectSearchPropsType = {
  searchTerm: string;
  isEnabled?: boolean;
};

export const useProjectSearch = ({
  searchTerm,
  isEnabled = true,
}: UseProjectSearchPropsType) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: projectsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [PROJECT_QUERY_KEYS.projects, debouncedSearchTerm],
    queryFn: () => getProjects({ search: debouncedSearchTerm || undefined }),
    enabled: isEnabled,
  });

  const projects = projectsData?.data ?? [];
  const totalProjects = projectsData?.total ?? 0;

  return {
    projects,
    totalProjects,
    isLoading,
    isError,
    error,
    debouncedSearchTerm,
  };
};
