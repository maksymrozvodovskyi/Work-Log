import { useMemo } from "react";
import { parseISO, isBefore, isAfter, startOfDay } from "date-fns";
import clsx from "clsx";
import type { ProjectType } from "@/types/Project";
import type { ProjectPosition } from "@/features/projects/types/timeline";
import { statusMap } from "@/types/StatusMap";
import { TIMELINE_CONSTANTS } from "@/features/projects/constants/timeline";
import { hexToRgba } from "@/utils/colorUtils";
import { useTimelineContext } from "@/features/projects/context/useTimelineContext";
import css from "@/features/projects/index.module.css";

type TimelineProjectBarProps = {
  project: ProjectType;
  position: ProjectPosition;
  rowNumber: number;
};

export const TimelineProjectBar = ({
  project,
  position,
  rowNumber,
}: TimelineProjectBarProps) => {
  const { monthBounds } = useTimelineContext();
  
  const { continuesFromPrevious, continuesToNext, gridStyles } = useMemo(() => {
    const startDate = startOfDay(parseISO(project.createdAt));
    const endDate = project.endDate ? startOfDay(parseISO(project.endDate)) : null;
    const statusColor = statusMap[project.status].color;
    const bgColor = hexToRgba(statusColor, TIMELINE_CONSTANTS.PROJECT_BAR_OPACITY);
    
    return {
      continuesFromPrevious: isBefore(startDate, monthBounds.start),
      continuesToNext: !endDate || isAfter(endDate, monthBounds.end),
      gridStyles: {
        gridColumn: `${position.start} / ${position.end}`,
        gridRow: rowNumber,
        backgroundColor: bgColor,
      },
    };
  }, [project.createdAt, project.endDate, project.status, monthBounds.start, monthBounds.end, position.start, position.end, rowNumber]);

  return (
    <div
      className={clsx(
        css.timelineProjectBar,
        continuesFromPrevious && css.continuesFromPrevious,
        continuesToNext && css.continuesToNext
      )}
      style={gridStyles}
      title={project.name}
    >
      <span className={css.timelineProjectBarText}>{project.name}</span>
    </div>
  );
};

