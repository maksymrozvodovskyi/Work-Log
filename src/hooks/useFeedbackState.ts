import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { FEEDBACK_VIEW_TYPES, type FeedbackViewType } from "@/config/feedbacks";

interface FeedbackState {
  search: string;
  view: FeedbackViewType;
  isSortDropdownOpen: boolean;
}

export const useFeedbackState = () => {
  const [state, setState] = useState<FeedbackState>({
    search: "",
    view: FEEDBACK_VIEW_TYPES.MY,
    isSortDropdownOpen: false,
  });

  const setSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, search }));
  }, []);

  const setView = useCallback((view: FeedbackViewType) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const toggleSortDropdown = useCallback(() => {
    setState(prev => ({ ...prev, isSortDropdownOpen: !prev.isSortDropdownOpen }));
  }, []);

  const closeSortDropdown = useCallback(() => {
    setState(prev => ({ ...prev, isSortDropdownOpen: false }));
  }, []);

  const debouncedSearch = useDebounce(state.search, 300);

  return {
    ...state,
    debouncedSearch,
    setSearch,
    setView,
    toggleSortDropdown,
    closeSortDropdown,
  };
};
