import { isFirstDayOfMonth, isToday, isWeekend } from "date-fns";
import clsx from "clsx";
import css from "../../index.module.css";

type BodyDayCellProps = {
  day: Date;
};

export default function BodyDayCell({ day }: BodyDayCellProps) {
  const isFirstDay = isFirstDayOfMonth(day);
  const today = isToday(day);

  return (
    <div className={css.dayColumn}>
      {isFirstDay && (
        <div className={clsx(css.monthNameSpacer, today && css.today)} />
      )}
      <div
        className={clsx(
          css.cell,
          isWeekend(day) && css.weekend,
          day.getDay() === 6 && css.isSaturday,
          today && css.today,
        )}
      />
    </div>
  );
}
