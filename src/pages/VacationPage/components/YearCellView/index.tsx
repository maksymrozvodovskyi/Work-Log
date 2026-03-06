import css from "./index.module.css";
import clsx from "clsx";
import { ALLOWANCE_PER_YEAR } from "@/features/vacations/constants";

type Props = {
  usedDays: number;
  remainingDays: number;
};

export default function YearCellView({ usedDays, remainingDays }: Props) {
  const isFull = remainingDays === 0;
  const filledBarClass = isFull ? css.barRed : css.barGreen;

  const bars = [];

  for (let i = 0; i < ALLOWANCE_PER_YEAR; i++) {
    const isFilled = i < usedDays;

    bars.push(
      <span
        key={i}
        className={clsx(css.bar, isFilled ? filledBarClass : css.barEmpty)}
      />,
    );
  }

  return (
    <div className={css.wrapper}>
      <div className={css.textRow}>
        <span className={css.mainValue}>
          {usedDays} / {ALLOWANCE_PER_YEAR}
        </span>
        <span className={css.leftValue}> ({remainingDays} left)</span>
      </div>

      <div className={css.barRow}>{bars}</div>
    </div>
  );
}
