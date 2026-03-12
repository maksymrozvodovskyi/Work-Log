import clsx from "clsx";
import BodyDayCell from "../BodyDayCell";
import css from "../../index.module.css";
import type { TimelineBar } from "../../../../utils/buildVisibleBars";
import { TIMELINE_CELL_WIDTH_PX } from "@/features/vacations/constants/timeline";

type UserTimelineRowProps = {
  daysToShow: Date[];
  bars: TimelineBar[];
};

export default function UserTimelineRow({
  daysToShow,
  bars,
}: UserTimelineRowProps) {
  return (
    <div className={css.userRow}>
      {daysToShow.map((day) => (
        <BodyDayCell key={day.toISOString()} day={day} />
      ))}

      <div
        className={css.barsLayer}
        style={{
          gridTemplateColumns: `repeat(${daysToShow.length}, ${TIMELINE_CELL_WIDTH_PX}px)`,
        }}
      >
        {bars.map((bar) => (
          <div
            key={bar.key}
            className={clsx(
              css.vacationBar,
              bar.isSingleDay && css.vacationBarSingleDay,
            )}
            style={{
              gridColumn: `${bar.columnStart} / ${bar.columnEnd}`,
            }}
            title={bar.fullName}
          >
            <span className={css.vacationName}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
