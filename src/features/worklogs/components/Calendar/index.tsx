import clsx from "clsx";
import ArrowIcon from "@/features/projects/svg/ArrowIcon";
import { MONTH_NAMES, WEEKDAYS } from "@/features/worklogs/constants/calendar";
import type { CalendarDayType } from "@/hooks/useCalendar";
import css from "./Calendar.module.css";

type CalendarPropsType = {
  currentDate: Date;
  calendarDays: CalendarDayType[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDayClick: (date: Date) => void;
};

export const Calendar = ({
  currentDate,
  calendarDays,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onDayClick,
}: CalendarPropsType) => {
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
                width: "16px",
                height: "16px",
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
                width: "16px",
                height: "16px",
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
                onClick={() => onDayClick(day.date)}
                aria-label={`Select ${day.date.toLocaleDateString()}`}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

