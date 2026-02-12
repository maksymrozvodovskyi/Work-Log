import { getUsers } from "@/api/users";
import { useItemSearch } from "@/features/projects/hooks/useItemSearch";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import type { ApiUserType } from "@/utils/userTransformers";

type UseUserSearchPropsType = {
  searchTerm: string;
  isEnabled?: boolean;
  excludeUserId?: string;
};

export const useUserSearch = ({
  searchTerm,
  isEnabled = true,
  excludeUserId,
}: UseUserSearchPropsType) => {
  const queryFn = (search: string) => {
    const params: { take: number; name?: string } = { take: 1000 };
    if (search) {
      params.name = search;
    }
    return getUsers(params);
  };

  const excludeKey = excludeUserId ? excludeUserId : "";
  const result = useItemSearch<ApiUserType>({
    searchTerm,
    isEnabled,
    queryKey: [USER_QUERY_KEYS.usersSearch, excludeKey],
    queryFn,
  });

  if (!excludeUserId) {
    return result;
  }

  const filteredItems = result.items.filter((u) => u.id !== excludeUserId);

  let excludeCount = 0;
  for (const u of result.items) {
    if (u.id === excludeUserId) {
      excludeCount = 1;
      break;
    }
  }

  let newTotal = result.total - excludeCount;
  if (newTotal < 0) {
    newTotal = 0;
  }

  return {
    ...result,
    items: filteredItems,
    total: newTotal,
  };
};

