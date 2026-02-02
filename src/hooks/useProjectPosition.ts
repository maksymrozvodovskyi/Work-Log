import { useCallback, useMemo } from "react";
import {
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
} from "date-fns";
import type { ProjectType } from "@/types/Project";
import type { TimelineDateItem, ProjectPosition } from "@/features/projects/types/timeline";

type DateItem = {
  item: TimelineDateItem;
  index: number;
  normalizedDate: Date;
};

const findStartIndex = (
  projectStart: Date,
  firstDate: Date,
  dateItems: DateItem[]
): number => {
  if (isBefore(projectStart, firstDate)) {
    return dateItems[0].index;
  }
  
  const found = dateItems.find(({ normalizedDate }) => 
    isSameDay(normalizedDate, projectStart) || isAfter(normalizedDate, projectStart)
  );
  
  return found?.index ?? dateItems[0].index;
};

const findEndIndex = (
  projectEnd: Date | null,
  dateItems: DateItem[]
): number => {
  if (!projectEnd) {
    return dateItems[dateItems.length - 1].index;
  }
  
  const exactMatch = dateItems.find(({ normalizedDate }) => 
    isSameDay(normalizedDate, projectEnd)
  );
  
  if (exactMatch) {
    return exactMatch.index;
  }
  
  const afterIndex = dateItems.findIndex(({ normalizedDate }) => 
    isAfter(normalizedDate, projectEnd)
  );
  
  if (afterIndex === -1) {
    return dateItems[dateItems.length - 1].index;
  }
  
  return dateItems[Math.max(0, afterIndex - 1)].index;
};

export const useProjectPosition = (
  timelineDates: TimelineDateItem[]
) => {
  const dateItems = useMemo(() => {
  return timelineDates
    .filter(item => !item.isMonthLabel)
    .map((item, index) => ({
      item,
      index,
      normalizedDate: startOfDay(item.fullDate),
    }));
}, [timelineDates]);

  const getProjectPosition = useCallback(
    (project: ProjectType): ProjectPosition | null => {
      if (dateItems.length === 0) {
        return null;
      }

      const projectStart = startOfDay(parseISO(project.createdAt));
      const projectEnd = project.endDate ? startOfDay(parseISO(project.endDate)) : null;

      const firstDate = dateItems[0].normalizedDate;
      const lastDate = dateItems[dateItems.length - 1].normalizedDate;

      const projectEndsAfterStart = !projectEnd || !isBefore(projectEnd, firstDate);
      const projectStartsBeforeEnd = !isAfter(projectStart, lastDate);

      if (!projectEndsAfterStart || !projectStartsBeforeEnd) {
        return null;
      }

      const startIndex = findStartIndex(projectStart, firstDate, dateItems);
      const endIndex = findEndIndex(projectEnd, dateItems);
      const finalEndIndex = Math.max(startIndex, endIndex);

      return {
        start: startIndex + 1,
        end: finalEndIndex + 2,
      };
    },
    [dateItems]
  );

  return getProjectPosition;
};

