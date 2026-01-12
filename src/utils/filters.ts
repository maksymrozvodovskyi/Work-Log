export const createSearchHandler = (
  setFilters: (filters: { search: string; page: number }) => void
) => {
  return (value: string) => {
    setFilters({ search: value, page: 1 });
  };
};

export const createStatusHandler = <T>(
  setFilters: (filters: { status: T | null; page: number }) => void
) => {
  return (newStatus: T | null) => {
    setFilters({ status: newStatus, page: 1 });
  };
};
