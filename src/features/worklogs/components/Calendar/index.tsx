import { useState } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import ArrowIcon from "@/components/svg/ArrowIcon";
import { MONTH_NAMES, WEEKDAYS } from "@/features/worklogs/constants/calendar";
import { ACTIVITY_COLOR_MAP } from "@/features/worklogs/constants/activityColors";
import { activityStatusMap, type ActivityType } from "@/types/Report";
import type { CalendarDayType } from "@/hooks/useCalendar";
import type { WorkLogByDateWithActivityType } from "@/features/worklogs/utils/groupWorkLogs";
import type { WorkLogsByTimeResponseType } from "@/types/WorkLog";
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
  activitiesByDate?: Record<string, ActivityType[]>;
  disabled?: boolean;
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
  activitiesByDate,
  disabled = false,
}: CalendarPropsType) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDayClick = (date: Date) => {
    if (disabled) return;
    setSelectedDate(date);
    onDayClick(date);
  };

  const getReportDayColors = (activities: ActivityType[]): string[] => {
    return activities
      .filter((a) => activityStatusMap[a])
      .map((a) => activityStatusMap[a].color);
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
            disabled={disabled}
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
            disabled={disabled}
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
          disabled={disabled}
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
            const dateKey = format(day.date, "yyyy-MM-dd");
            const reportDayColors = getReportDayColors(
              activitiesByDate?.[dateKey] ?? []
            );

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
                disabled={disabled}
              >
                {dayNumber}
                {activityColor && (
                  <span
                    className={css.calendarDayDot}
                    style={{ backgroundColor: activityColor }}
                  />
                )}
                {!activityColor && reportDayColors.length > 0 && (
                  <span className={css.calendarDayDotsContainer}>
                    {reportDayColors.map((color, i) => (
                      <span
                        key={i}
                        className={css.calendarDayDotReports}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
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

