import { useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import { format, getDaysInMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import ArrowIcon from "@/components/svg/ArrowIcon";
import CheckmarkIcon from "@/components/svg/CheckmarkIcon";
import { MONTH_NAMES, WEEKDAYS } from "@/features/worklogs/constants/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getReportsCountsForRange } from "@/api/reports";
import {
  REPORT_TYPE_COLOR_MAP,
  REPORT_TYPES,
} from "@/features/reports/constants/reportTypeColors";
import type { CalendarDayType } from "@/hooks/useCalendar";
import css from "@/features/worklogs/components/Calendar/Calendar.module.css";
import reportsCss from "./ReportsCalendar.module.css";

type ReportsCalendarPropsType = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

export const ReportsCalendar = ({
  selectedDate,
  onDateChange,
}: ReportsCalendarPropsType) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = currentYear - 4; year <= currentYear; year++) {
    years.push(year);
  }

  const {
    currentDate,
    calendarDays,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
    navigateToDate,
  } = useCalendar(selectedDate, selectedDate);

  const { startDate, endDate } = useMemo(() => {
    const first = calendarDays[0]?.date;

    const last = calendarDays[calendarDays.length - 1]?.date;

    return {
      startDate: first ? format(first, "yyyy-MM-dd") : "",
      endDate: last ? format(last, "yyyy-MM-dd") : "",
    };
  }, [calendarDays]);

  const { data: reportsByDate } = useQuery({
    queryKey: [
      "reports",
      "counts",
      "month",
      currentDate.getFullYear(),
      currentDate.getMonth(),
    ],
    queryFn: () => getReportsCountsForRange(startDate, endDate),
    enabled: Boolean(startDate && endDate),
  });

  const getReportTypeDots = (dateKey: string) => {
    const counts = reportsByDate?.[dateKey];

    if (!counts) return [];

    return REPORT_TYPES.filter((type) => counts[type] > 0).map((type) => ({
      type,
      color: REPORT_TYPE_COLOR_MAP[type],
    }));
  };

  const yearDropdownRef = useClickOutside<HTMLDivElement>(
    () => setIsYearDropdownOpen(false),
    isYearDropdownOpen,
  );

  const monthDropdownRef = useClickOutside<HTMLDivElement>(
    () => setIsMonthDropdownOpen(false),
    isMonthDropdownOpen,
  );

  useEffect(() => {
    navigateToDate(selectedDate);
  }, [selectedDate, navigateToDate]);

  const handleDayClick = (date: Date) => {
    onDateChange(date);
  };

  const handleTodayClick = () => {
    handleToday();
    onDateChange(new Date());
  };

  const handleYearSelect = (year: number) => {
    const month = currentDate.getMonth();
    const maxDay = getDaysInMonth(new Date(year, month));
    const day = Math.min(selectedDate.getDate(), maxDay);
    const newDate = new Date(year, month, day);
    navigateToDate(newDate);
    onDateChange(newDate);
    setIsYearDropdownOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const year = currentDate.getFullYear();
    const maxDay = getDaysInMonth(new Date(year, monthIndex));
    const day = Math.min(selectedDate.getDate(), maxDay);
    const newDate = new Date(year, monthIndex, day);
    navigateToDate(newDate);
    onDateChange(newDate);
    setIsMonthDropdownOpen(false);
  };

  return (
    <div className={css.calendarSection}>
      <div className={css.calendarNav}>
        <div className={css.calendarNavArrows}>
          <button
            type="button"
            className={css.calendarNavArrow}
            onClick={handlePreviousMonth}
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
            onClick={handleNextMonth}
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
          <div ref={monthDropdownRef} className={reportsCss.yearWrapper}>
            <button
              type="button"
              className={clsx(css.calendarMonthName, reportsCss.monthButton)}
              onClick={() => {
                setIsMonthDropdownOpen((prev) => !prev);
                if (!isMonthDropdownOpen) setIsYearDropdownOpen(false);
              }}
            >
              {format(currentDate, "MMMM")}
            </button>
            {isMonthDropdownOpen && (
              <div className={reportsCss.monthDropdown}>
                {MONTH_NAMES.map((monthName, monthIndex) => {
                  const isSelected = monthIndex === currentDate.getMonth();
                  return (
                    <button
                      key={monthName}
                      type="button"
                      className={clsx(
                        reportsCss.monthDropdownItem,
                        isSelected && reportsCss.monthDropdownItemSelected,
                      )}
                      onClick={() => handleMonthSelect(monthIndex)}
                    >
                      {monthName}
                      {isSelected && <CheckmarkIcon fill="#F5F6FA" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div ref={yearDropdownRef} className={reportsCss.yearWrapper}>
            <button
              type="button"
              className={clsx(css.calendarMonthYear, reportsCss.yearButton)}
              onClick={() => {
                setIsYearDropdownOpen((prev) => !prev);
                if (!isYearDropdownOpen) setIsMonthDropdownOpen(false);
              }}
            >
              {currentDate.getFullYear()}
            </button>
            {isYearDropdownOpen && (
              <div className={reportsCss.yearDropdown}>
                {years.map((year) => {
                  const isSelected = year === currentDate.getFullYear();
                  return (
                    <button
                      key={year}
                      type="button"
                      className={clsx(
                        reportsCss.yearDropdownItem,
                        isSelected && reportsCss.yearDropdownItemSelected,
                      )}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                      {isSelected && <CheckmarkIcon fill="#F5F6FA" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className={css.todayButton}
          onClick={handleTodayClick}
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
          {calendarDays.map((day: CalendarDayType, index: number) => {
            const dayNumber = day.date.getDate();
            const isGrayDay = !day.isCurrentMonth || day.isWeekend;
            const isCurrentMonthDay = day.isCurrentMonth && !day.isWeekend;
            const dateKey = format(day.date, "yyyy-MM-dd");
            const reportDots = getReportTypeDots(dateKey);

            return (
              <button
                key={index}
                type="button"
                className={clsx(
                  isCurrentMonthDay && css.calendarDay,
                  isGrayDay && css.calendarDayOther,
                  day.isSelected && css.calendarDaySelected,
                  day.isToday &&
                    !day.isSelected &&
                    isCurrentMonthDay &&
                    css.calendarDayBrown,
                )}
                onClick={() => handleDayClick(day.date)}
              >
                {dayNumber}
                {reportDots.length > 0 && (
                  <span className={reportsCss.reportDots}>
                    {reportDots.map(({ type, color }) => (
                      <span
                        key={type}
                        className={reportsCss.reportDot}
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
    </div>
  );
};
