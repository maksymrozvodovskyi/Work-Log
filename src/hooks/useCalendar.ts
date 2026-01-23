import { useState, useMemo } from "react";
import { startOfMonth, getDaysInMonth, subMonths, addMonths, isToday } from "date-fns";

export type CalendarDayType = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  isInRange: boolean;
};

export const useCalendar = (
  startDate: Date | null,
  endDate: Date | null
) => {
  const [currentDate, setCurrentDate] = useState(() => startOfMonth(new Date()));

  const calendarDays = useMemo((): CalendarDayType[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = startOfMonth(currentDate);
    const lastDay = getDaysInMonth(currentDate);
    const firstDayOfWeek = firstDay.getDay();
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: CalendarDayType[] = [];

    const isWeekend = (date: Date) => {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    };

    const isDateInRange = (date: Date): boolean => {
      if (!startDate || !endDate) return false;
      const dateStr = date.toDateString();
      return dateStr >= startDate.toDateString() && dateStr <= endDate.toDateString();
    };

    const isDateSelected = (date: Date): boolean => {
      const dateStr = date.toDateString();
      return (startDate !== null && dateStr === startDate.toDateString()) || 
             (endDate !== null && dateStr === endDate.toDateString());
    };

    const prevMonthLastDay = getDaysInMonth(subMonths(currentDate, 1));
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isDateSelected(date),
        isWeekend: isWeekend(date),
        isInRange: isDateInRange(date),
      });
    }

    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        isSelected: isDateSelected(date),
        isWeekend: isWeekend(date),
        isInRange: isDateInRange(date),
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isDateSelected(date),
        isWeekend: isWeekend(date),
        isInRange: isDateInRange(date),
      });
    }

    return days;
  }, [currentDate, startDate, endDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(startOfMonth(new Date()));
  };

  const navigateToDate = (date: Date) => {
    setCurrentDate(startOfMonth(date));
  };

  return {
    currentDate,
    calendarDays,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
    navigateToDate,
  };
};

