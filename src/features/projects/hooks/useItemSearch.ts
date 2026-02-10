import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";

type UseItemSearchProps<T> = {
  searchTerm: string;
  isEnabled: boolean;
  queryKey: string[];
  queryFn: (search: string) => Promise<{ data: T[]; total: number }>;
};

export const useItemSearch = <T>({
  searchTerm,
  isEnabled,
  queryKey,
  queryFn,
}: UseItemSearchProps<T>) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [...queryKey, debouncedSearchTerm],
    queryFn: () => queryFn(debouncedSearchTerm),
    enabled: isEnabled,
  });

  const items = useMemo(() => data?.data ?? [], [data?.data]);
  const total = useMemo(() => data?.total ?? 0, [data?.total]);

  return {
    items: items as T[],
    total,
    isLoading,
    isError,
    error: error || undefined,
  };
};
