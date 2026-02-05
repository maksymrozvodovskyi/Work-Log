import { useState } from "react";
import { format } from "date-fns";
import type { ProjectStatusType } from "@/types/Project";
import { PROJECT_STATUS_ORDER } from "@/features/projects/constants/projectStatusOrder";
import { statusMap } from "@/types/StatusMap";
import { useTimelineContext } from "@/features/projects/context/useTimelineContext";
import css from "@/features/projects/index.module.css";
import FilterButton from "@/components/FilterButton";
import StatusFilter from "@/components/StatusFilter";
import ArrowIcon from "@/components/svg/ArrowIcon";
import PlusIcon from "@/components/svg/PlusIcon";
import CreateTimelineModal from "@/features/projects/components/CreateTimelineModal";

const ARROW_ICON_STYLES = {
  previous: { transform: "rotate(90deg)" },
  next: { transform: "rotate(-90deg)" },
} as const;

type FilterStateType = {
  status: ProjectStatusType | null;
  isDisabled: boolean;
};

type FilterActionsType = {
  onStatusChange: (status: ProjectStatusType | null) => void;
  onClearFilters: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

type TimelineFilterBarPropsType = {
  state: FilterStateType;
  actions: FilterActionsType;
};

export const TimelineFilterBar = ({
  state,
  actions,
}: TimelineFilterBarPropsType) => {
  const { currentDate } = useTimelineContext();
  const { status, isDisabled } = state;
  const { onPreviousMonth, onNextMonth, onStatusChange, onClearFilters } = actions;
  
  const [isCreateTimelineModalOpen, setIsCreateTimelineModalOpen] = useState(false);
  
  const formattedDate = format(currentDate, "MMMM yyyy");

  return (
    <div className={css.timelineFilterBar}>
      <div className={css.dateNavigation}>
        <button
          type="button"
          className={css.dateNavButton}
          onClick={onPreviousMonth}
          aria-label="Previous month"
          disabled={isDisabled}
        >
          <ArrowIcon style={ARROW_ICON_STYLES.previous} />
        </button>
        <button
          type="button"
          className={css.dateNavButton}
          onClick={onNextMonth}
          aria-label="Next month"
          disabled={isDisabled}
        >
          <ArrowIcon style={ARROW_ICON_STYLES.next} />
        </button>
      <span className={css.dateText}>{formattedDate}</span>
      </div>

      <FilterButton
        onClick={onClearFilters}
        ariaLabel="Clear all filters"
        disabled={isDisabled}
      />

      <StatusFilter
        statusOrder={PROJECT_STATUS_ORDER}
        statusMap={statusMap}
        selectedStatus={status}
        onStatusChange={onStatusChange}
        entityType="projects"
        disabled={isDisabled}
      />

      <button
        type="button"
        className={css.addTimelineButton}
        aria-label="Add timeline"
        disabled={isDisabled}
        onClick={() => setIsCreateTimelineModalOpen(true)}
      >
        Add timeline
        <PlusIcon />
      </button>

      <CreateTimelineModal
        isOpen={isCreateTimelineModalOpen}
        onClose={() => setIsCreateTimelineModalOpen(false)}
      />
    </div>
  );
};

