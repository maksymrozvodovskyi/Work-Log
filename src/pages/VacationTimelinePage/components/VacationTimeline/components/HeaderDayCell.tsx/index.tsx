import { format, isFirstDayOfMonth, isToday } from "date-fns";
import clsx from "clsx";
import css from "../../index.module.css";

type HeaderDayCellProps = {
  day: Date;
};

export default function HeaderDayCell({ day }: HeaderDayCellProps) {
  const isSat = day.getDay() === 6;
  const isSun = day.getDay() === 0;
  const isFirstDay = isFirstDayOfMonth(day);
  const today = isToday(day);

  return (
    <div className={css.dayColumn}>
      {isFirstDay && (
        <div className={clsx(css.monthNameColumn, today && css.today)}>
          <div className={css.monthNameCell}>{format(day, "MMM")}</div>
        </div>
      )}
      <div
        className={clsx(
          css.dayCell,
          (isSat || isSun) && css.weekend,
          isSat && css.isSaturday,
          today && css.today,
        )}
      >
        <span className={css.dayNum}>{format(day, "d")}</span>
        <span className={css.dayName}>{format(day, "eeeeee").charAt(0)}</span>
      </div>
    </div>
  );
}
