import { useState } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import ArrowIcon from "@/components/svg/ArrowIcon";
import { MONTH_NAMES, WEEKDAYS } from "@/features/worklogs/constants/calendar";
import { ACTIVITY_COLOR_MAP } from "@/features/worklogs/constants/activityColors";
import type { CalendarDayType } from "@/hooks/useCalendar";
import type { WorkLogByDateWithActivityType } from "@/features/worklogs/utils/groupWorkLogs";
import type { WorkLogsByTimeResponseType } from "@/types/WorkLog";
import { ActivityTypeValues } from "@/types/WorkLog";
import { ActivityCard } from "./ActivityCard";
import css from "./Calendar.module.css";

type CalendarPropsType = {
  currentDate: Date;
  calendarDays: CalendarDayType[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDayClick: (date: Date) => void;
  workLogsByDate?: Map<string, WorkLogByDateWithActivityType>;
  calendarWorkLogsData?: WorkLogsByTimeResponseType;
};

export const Calendar = ({
  currentDate,
  calendarDays,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onDayClick,
  workLogsByDate,
  calendarWorkLogsData,
}: CalendarPropsType) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDayClick(date);
  };

  const getDayActivityColor = (date: Date): string | null => {
    if (!workLogsByDate) {
      return null;
    }

    const dateKey = format(date, "yyyy-MM-dd");
    const workLogEntry = workLogsByDate.get(dateKey);

    if (!workLogEntry || !workLogEntry.hasWorkHours || !workLogEntry.primaryActivity) {
      return null;
    }

    if (
      workLogEntry.primaryActivity === ActivityTypeValues.VACATION ||
      workLogEntry.primaryActivity === ActivityTypeValues.SICKLEAVE
    ) {
      return null;
    }

    return ACTIVITY_COLOR_MAP[workLogEntry.primaryActivity as keyof typeof ACTIVITY_COLOR_MAP] || null;
  };
  return (
    <div className={css.calendarSection}>
      <div className={css.calendarNav}>
        <div className={css.calendarNavArrows}>
          <button
            type="button"
            className={css.calendarNavArrow}
            aria-label="Previous month"
            onClick={onPreviousMonth}
          >
            <ArrowIcon
              style={{
                width: "12px",
                height: "12px",
                transform: "rotate(90deg)",
                transformOrigin: "center",
              }}
            />
          </button>
          <button
            type="button"
            className={css.calendarNavArrow}
            aria-label="Next month"
            onClick={onNextMonth}
          >
            <ArrowIcon
              style={{
                width: "12px",
                height: "12px",
                transform: "rotate(-90deg)",
                transformOrigin: "center",
              }}
            />
          </button>
        </div>
        <div className={css.calendarMonth}>
          <span className={css.calendarMonthName}>
            {MONTH_NAMES[currentDate.getMonth()]}
          </span>
          <span className={css.calendarMonthYear}>
            {currentDate.getFullYear()}
          </span>
        </div>
        <button 
          type="button" 
          className={css.todayButton}
          onClick={onToday}
        >
          Today
        </button>
      </div>
      <div className={css.calendarGrid}>
        <div className={css.calendarWeekdays}>
          {WEEKDAYS.map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>
        <div className={css.calendarDays}>
          {calendarDays.map((day, index) => {
            const dayNumber = day.date.getDate();
            const isGrayDay = !day.isCurrentMonth || day.isWeekend;
            const isCurrentMonthDay = day.isCurrentMonth && !day.isWeekend;
            const activityColor = getDayActivityColor(day.date);
            
            return (
              <button
                key={index}
                type="button"
                className={clsx(
                  isCurrentMonthDay && css.calendarDay,
                  isGrayDay && css.calendarDayOther,
                  day.isSelected && css.calendarDaySelected,
                  day.isToday && !day.isSelected && isCurrentMonthDay && css.calendarDayBrown
                )}
                onClick={() => handleDayClick(day.date)}
                aria-label={`Select ${day.date.toLocaleDateString()}`}
              >
                {dayNumber}
                {activityColor && (
                  <span
                    className={css.calendarDayDot}
                    style={{ backgroundColor: activityColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <ActivityCard
        selectedDate={selectedDate}
        workLogsData={calendarWorkLogsData}
      />
    </div>
  );
};

