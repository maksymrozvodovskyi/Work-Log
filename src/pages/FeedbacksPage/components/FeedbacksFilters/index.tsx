import { useState } from "react";
import clsx from "clsx";
import SearchInput from "@/components/SearchInput";
import CheckmarkIcon from "@/components/svg/CheckmarkIcon";
import ArrowIcon from "@/components/svg/ArrowIcon";
import PlusIcon from "@/components/svg/PlusIcon";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  useFeedbackQueryParams,
  type FeedbackSortOption,
} from "@/hooks/useFeedbackQueryParams";
import css from "@/features/feedbacks/index.module.css";

export type { FeedbackSortOption };

interface FeedbacksFiltersProps {
  onAddFeedback?: () => void;
  hideDivider?: boolean;
}

export default function FeedbacksFilters({
  onAddFeedback,
  hideDivider,
}: FeedbacksFiltersProps) {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const {
    search,
    setSearch,
    currentSortType: sort,
    handleSortChange: onSortChange,
  } = useFeedbackQueryParams();

  const sortDropdownRef = useClickOutside<HTMLDivElement>(
    () => setIsSortDropdownOpen(false),
    isSortDropdownOpen,
  );

  const SORT_OPTIONS: FeedbackSortOption[] = [
    "New",
    "Old",
    "Last 7 days",
    "Last 30 days",
  ];

  return (
    <section
      className={clsx(
        css.filterWrapper,
        hideDivider && css.filterWrapperNoDivider,
      )}
    >
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by text"
        variant="shortUnderscore"
      />

      <div className={css.filterButtonsWrapper}>
        <div className={css.filterControls}>
          <div className={css.sortButtonWrapper} ref={sortDropdownRef}>
            <button
              type="button"
              className={css.sortButton}
              onClick={() => setIsSortDropdownOpen((prev) => !prev)}
            >
              Sort by: {sort}
              <ArrowIcon
                className={clsx(
                  css.arrowIcon,
                  isSortDropdownOpen && css.arrowIconOpen,
                )}
              />
            </button>
            {isSortDropdownOpen && (
              <div className={css.sortDropdown}>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={css.dropdownItem}
                    onClick={() => onSortChange(option)}
                  >
                    {option}
                    {sort === option && (
                      <CheckmarkIcon
                        fill="#fff"
                        className={css.dropdownItemCheckmark}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {onAddFeedback && (
          <button
            type="button"
            className={css.createButton}
            onClick={onAddFeedback}
          >
            Add feedback
            <span className={css.createButtonIcon}>
              <PlusIcon />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
