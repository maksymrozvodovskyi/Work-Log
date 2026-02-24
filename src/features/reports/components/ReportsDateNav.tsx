import { format, subDays, addDays, isToday } from "date-fns";
import DateNavLeftArrowIcon from "@/components/svg/DateNavLeftArrowIcon";
import DateNavRightArrowIcon from "@/components/svg/DateNavRightArrowIcon";
import css from "@/features/reports/index.module.css";

type ReportsDateNavPropsType = {
  date: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
};

const ReportsDateNav = ({
  date,
  onDateChange,
  disabled = false,
}: ReportsDateNavPropsType) => {
  const handlePreviousDay = () => {
    onDateChange(subDays(date, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(date, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const day = format(date, "d");
  const month = format(date, "MMM");
  const year = format(date, "yyyy");

  return (
    <div className={css.dateNav}>
      <div className={css.dateNavArrows}>
        <button
          type="button"
          className={css.dateNavButton}
          onClick={handlePreviousDay}
          disabled={disabled}
        >
          <DateNavLeftArrowIcon />
        </button>
        <button
          type="button"
          className={css.dateNavButton}
          onClick={handleNextDay}
          disabled={disabled}
        >
          <DateNavRightArrowIcon />
        </button>
      </div>
      <span className={css.datePart}>{day}</span>
      <span className={css.datePart}>{month}</span>
      <span className={css.datePart}>{year}</span>
      <button
        type="button"
        className={css.todayButton}
        onClick={handleToday}
        disabled={disabled || isToday(date)}
      >
        Today
      </button>
    </div>
  );
};

export default ReportsDateNav;
