import { useMemo } from "react";
import type { ProjectType } from "@/types/Project";
import type { ProjectPosition } from "@/features/projects/types/timeline";
import { useTimelineContext } from "@/features/projects/context/useTimelineContext";
import { TIMELINE_CONSTANTS } from "@/features/projects/constants/timeline";
import css from "@/features/projects/index.module.css";
import Loader from "@/components/Loader";
import { TimelineDateCell } from "../TimelineDateCell";
import { TimelineRow } from "../TimelineRow";

type TimelineGridPropsType = {
  getProjectPosition: (project: ProjectType) => ProjectPosition | null;
  showInitialLoader: boolean;
};

export const TimelineGrid = ({
  getProjectPosition,
  showInitialLoader,
}: TimelineGridPropsType) => {
  const { timelineDates, users, projects } = useTimelineContext();
  
  const gridStyles = useMemo(() => ({
    gridTemplateColumns: `repeat(${timelineDates.length}, ${TIMELINE_CONSTANTS.CELL_WIDTH}px)`,
    gridTemplateRows: users.length > 0
      ? `auto repeat(${users.length}, ${TIMELINE_CONSTANTS.ACTUAL_ROW_HEIGHT}px)`
      : "auto",
  }), [timelineDates.length, users.length]);

  return (
    <div
      className={css.timelineGrid}
      style={gridStyles}
    >
      {showInitialLoader && (
        <div className={css.timelineLoaderContainer}>
          <Loader size="medium" />
        </div>
      )}

      {timelineDates.map((dateItem, index) => (
        <TimelineDateCell
          key={index}
          dateItem={dateItem}
          index={index}
          rowNumber={1}
        />
      ))}

      {users.map((user, userIndex) => (
        <TimelineRow
          key={user.id}
          user={user}
          userIndex={userIndex}
          timelineDates={timelineDates}
          projects={projects}
          getProjectPosition={getProjectPosition}
        />
      ))}
    </div>
  );
};

