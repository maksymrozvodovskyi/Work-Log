import { eachDayOfInterval, addDays } from "date-fns";
import css from "./index.module.css";
import {
  TIMELINE_PERIOD_DAYS,
  TIMELINE_ROWS_COUNT,
} from "@/features/vacations/constants/timeline";
import { buildVisibleBars } from "../../utils/buildVisibleBars";
import HeaderDayCell from "./components/HeaderDayCell.tsx";
import UserTimelineRow from "./components/UserTimelineRow";
import type { VacationStats } from "../../types/vacations";

type User = {
  id: string;
  name: string;
  vacationStatus: VacationStats;
};

type VacationTimelineProps = {
  currentDate: Date;
  users: User[];
};

export default function VacationTimeline({
  currentDate,
  users,
}: VacationTimelineProps) {
  const daysToShow = eachDayOfInterval({
    start: currentDate,
    end: addDays(currentDate, TIMELINE_PERIOD_DAYS),
  });

  const barsByUser = users.map((user) => buildVisibleBars(user, daysToShow));

  return (
    <div className={css.timelineContainer}>
      <div className={css.header}>
        {daysToShow.map((day) => (
          <HeaderDayCell key={day.toString()} day={day} />
        ))}
      </div>

      <div className={css.body}>
        {Array.from({ length: TIMELINE_ROWS_COUNT }).map((_, rowIndex) => (
          <UserTimelineRow
            key={`row-${rowIndex}`}
            daysToShow={daysToShow}
            bars={barsByUser[rowIndex] ?? []}
          />
        ))}
      </div>
    </div>
  );
}
