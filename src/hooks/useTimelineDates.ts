import { useMemo } from "react";
import {
  format,
  getDaysInMonth,
  startOfMonth,
  getDay,
  addMonths,
  addDays,
} from "date-fns";
import type { TimelineDateItem } from "@/features/projects/types/timeline";
import { TIMELINE_CONSTANTS } from "@/features/projects/constants/timeline";

const isWeekend = (dayOfWeek: number): boolean => {
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const createDateItem = (
  date: Date,
  isMonthLabel: boolean = false,
  monthName?: string,
  nextIsWeekend: boolean | null = null,
  prevIsWeekend?: boolean
): TimelineDateItem => {
  const dayOfWeek = getDay(date);
  const isWeekendDay = isWeekend(dayOfWeek);

  return {
    dayOfWeek: isMonthLabel ? "" : format(date, "EEE").charAt(0),
    dayNumber: isMonthLabel ? "" : format(date, "d"),
    fullDate: date,
    isWeekend: isWeekendDay,
    nextIsWeekend,
    prevIsWeekend,
    isMonthLabel,
    monthName,
  };
};

const createDateItems = (
  startDate: Date,
  count: number
): TimelineDateItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(startDate, i);
    const nextDate = i < count - 1 ? addDays(startDate, i + 1) : null;
    const nextIsWeekend = nextDate ? isWeekend(getDay(nextDate)) : null;
    
    return createDateItem(date, false, undefined, nextIsWeekend);
  });
};

export const useTimelineDates = (currentDate: Date): TimelineDateItem[] => {
  return useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const lastDate = addDays(monthStart, daysInMonth - 1);
    const lastDayIsWeekend = isWeekend(getDay(lastDate));

    const nextMonth = addMonths(currentDate, 1);
    const nextMonthStart = startOfMonth(nextMonth);
    const nextMonthName = format(nextMonth, "MMMM");
    const firstDayIsWeekend = isWeekend(getDay(nextMonthStart));

    return [
      ...createDateItems(monthStart, daysInMonth),
      createDateItem(
        nextMonth,
        true,
        nextMonthName,
        firstDayIsWeekend,
        lastDayIsWeekend
      ),
      ...createDateItems(
        nextMonthStart,
        TIMELINE_CONSTANTS.DAYS_TO_SHOW_NEXT_MONTH
      ),
    ];
  }, [currentDate]);
};

