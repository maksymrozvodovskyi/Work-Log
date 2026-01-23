import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserToProject } from "@/api/projects";
import { PROJECT_QUERY_KEYS } from "@/features/projects/queryKeys";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import { handleAxiosError } from "@/utils/axiosError";

type UseInviteUsersPropsType = {
  userId: string;
  onSuccess?: (selectedIds: Set<string>) => void;
  onClose?: () => void;
};

export const useInviteUsers = ({
  userId,
  onSuccess,
  onClose,
}: UseInviteUsersPropsType) => {
  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: ({ projectId }: { projectId: string }) =>
      addUserToProject(projectId, userId),
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEYS.projects] });
    queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.users] });
    queryClient.invalidateQueries({
      queryKey: ["userProjects", userId],
      exact: false
    });
  };

  const inviteUsersToProjects = async (selectedIds: Set<string>) => {
    if (selectedIds.size === 0) return;

    try {
      const results = await Promise.allSettled(
        Array.from(selectedIds).map((projectId) =>
          addUserMutation.mutateAsync({ projectId })
        )
      );

      const failures = results.filter((result): result is PromiseRejectedResult =>
        result.status === 'rejected'
      );

      if (failures.length > 0) {
        throw new Error(`Failed to invite to ${failures.length} projects`);
      }

      invalidateQueries();
      onSuccess?.(selectedIds);
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : handleAxiosError(err, "Failed to invite user to projects");

      throw new Error(errorMessage);
    }
  };

  return {
    inviteUsersToProjects,
    isInviting: addUserMutation.isPending,
  };
};
