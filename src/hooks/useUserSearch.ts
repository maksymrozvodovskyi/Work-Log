import { getUsers } from "@/api/users";
import { useItemSearch } from "@/features/projects/hooks/useItemSearch";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import type { ApiUserType } from "@/utils/userTransformers";

type UseUserSearchPropsType = {
  searchTerm: string;
  isEnabled?: boolean;
};

export const useUserSearch = ({
  searchTerm,
  isEnabled = true,
}: UseUserSearchPropsType) => {
  return useItemSearch<ApiUserType>({
    searchTerm,
    isEnabled,
    queryKey: [USER_QUERY_KEYS.usersSearch],
    queryFn: (search) => getUsers({
      ...(search ? { name: search } : {}),
      take: 1000,
    }),
  });
};

