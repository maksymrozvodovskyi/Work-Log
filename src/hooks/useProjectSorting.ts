import { useQueryStates } from "nuqs";
import { parsers } from "@/utils/parsers";
import { SORT_FIELDS, DEFAULT_SORT_FIELD } from "@/constants/sort";

type UserProjectsSortFieldType = (typeof SORT_FIELDS)[number];

export const useProjectSorting = () => {
  const parseAsUserProjectsSortField = parsers.sortField<UserProjectsSortFieldType>(
    [...SORT_FIELDS],
    DEFAULT_SORT_FIELD
  );
  const parseAsSortDirection = parsers.sortDirection();

  const [{ sortField, sortDirection }, setFilters] = useQueryStates({
    sortField: parseAsUserProjectsSortField.withDefault(DEFAULT_SORT_FIELD),
    sortDirection: parseAsSortDirection.withDefault("asc"),
  });

  const handleSortChange = (newSortField: UserProjectsSortFieldType) => {
    if (sortField === newSortField) {
      setFilters({
        sortDirection: sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setFilters({
        sortField: newSortField,
      });
    }
  };

  return {
    sortField,
    sortDirection,
    handleSortChange,
    setSortFilters: setFilters,
  };
};
