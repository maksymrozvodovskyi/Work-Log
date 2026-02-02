import { useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { getUsers } from "@/api/users";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import { TIMELINE_CONSTANTS } from "@/features/projects/constants/timeline";

export const useTimelineUsers = () => {
  const [userSearch, setUserSearch] = useState("");
  const debouncedUserSearch = useDebounce(userSearch, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [USER_QUERY_KEYS.users, debouncedUserSearch],
    queryFn: async ({ pageParam = 0 }) => {
      const take = pageParam === 0 
        ? TIMELINE_CONSTANTS.INITIAL_LOAD_SIZE 
        : TIMELINE_CONSTANTS.LOAD_MORE_SIZE;
      return getUsers({
        name: debouncedUserSearch,
        skip: pageParam,
        take,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    initialPageParam: 0,
  });

  const users = data?.pages.flatMap((page) => page.data) ?? [];
  const isLoadingUsers = isLoading || isFetching;
  const hasMore = Boolean(hasNextPage);

  const loadMoreUsers = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    users,
    userSearch,
    setUserSearch,
    isLoadingUsers,
    isLoadingMore: isFetchingNextPage,
    hasMore,
    loadMoreUsers,
  };
};

