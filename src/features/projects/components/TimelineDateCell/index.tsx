import { useMemo } from "react";
import { isSameDay } from "date-fns";
import clsx from "clsx";
import type { TimelineDateItem } from "@/features/projects/types/timeline";
import { useTimelineContext } from "@/features/projects/context/useTimelineContext";
import css from "@/features/projects/index.module.css";

type TimelineDateCellProps = {
  dateItem: TimelineDateItem;
  index: number;
  rowNumber: number;
};

export const TimelineDateCell = ({
  dateItem,
  index,
  rowNumber,
}: TimelineDateCellProps) => {
  const { todayDate } = useTimelineContext();
  
  const gridStyles = {
    gridColumn: `${index + 1} / ${index + 2}`,
    gridRow: rowNumber,
  };

  const { isHeaderRow, cellClasses, monthLabelClasses } = useMemo(() => {
    if (dateItem.isMonthLabel) {
      return {
        isHeaderRow: false,
        cellClasses: undefined,
        monthLabelClasses: clsx(
          rowNumber === 1 ? css.monthLabelCell : css.timelineGridCell,
          dateItem.nextIsWeekend ? css.gapWeekend : css.gapWeekday,
          dateItem.prevIsWeekend ? css.gapWeekendLeft : css.gapWeekdayLeft
        ),
      };
    }

    const today = isSameDay(dateItem.fullDate, todayDate);
    const headerRow = rowNumber === 1;
    const gapClass = dateItem.nextIsWeekend !== null 
      ? (dateItem.nextIsWeekend ? css.gapWeekend : css.gapWeekday)
      : undefined;
    
    return {
      isHeaderRow: headerRow,
      cellClasses: clsx(
        css.timelineGridCell,
        headerRow && css.timelineDateCell,
        dateItem.isWeekend ? css.weekendCell : css.weekdayCell,
        today && css.todayCell,
        gapClass
      ),
      monthLabelClasses: undefined,
    };
  }, [dateItem.isMonthLabel, dateItem.fullDate, dateItem.isWeekend, dateItem.nextIsWeekend, dateItem.prevIsWeekend, todayDate, rowNumber]);

  if (dateItem.isMonthLabel) {
    return (
      <div
        className={monthLabelClasses}
        style={gridStyles}
      >
        {rowNumber === 1 && dateItem.monthName && (
          <span className={css.monthLabelText}>{dateItem.monthName}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cellClasses} style={gridStyles}>
      {isHeaderRow && (
        <>
          <span className={css.dayNumber}>{dateItem.dayNumber}</span>
          <span className={css.dayOfWeek}>{dateItem.dayOfWeek}</span>
        </>
      )}
    </div>
  );
};
