import { isAfter, isBefore, differenceInCalendarDays } from "date-fns";
import { formatTimelineBarName, formatUserName } from "./formatUserName";
import type { VacationStats } from "../types/vacations";

type TimelineUser = {
  id: string;
  name: string;
  vacationStatus: VacationStats;
};

export type TimelineBar = {
  key: string;
  columnStart: number;
  columnEnd: number;
  isSingleDay: boolean;
  label: string;
  fullName: string;
};

export function buildVisibleBars(
  user: TimelineUser | undefined,
  daysToShow: Date[],
): TimelineBar[] {
  if (!user || !daysToShow.length) return [];

  const firstVisibleDay = daysToShow[0];
  const lastVisibleDay = daysToShow[daysToShow.length - 1];

  const allVacationRanges = [
    ...user.vacationStatus.used,
    ...user.vacationStatus.active,
    ...user.vacationStatus.future,
  ];

  return allVacationRanges.flatMap((vacation, vacationIndex) => {
    const isOutsideTimeline =
      isAfter(vacation.startDate, lastVisibleDay) ||
      isBefore(vacation.endDate, firstVisibleDay);

    if (isOutsideTimeline) return [];

    const barStartDay = isAfter(vacation.startDate, firstVisibleDay)
      ? vacation.startDate
      : firstVisibleDay;

    const barEndDay = isBefore(vacation.endDate, lastVisibleDay)
      ? vacation.endDate
      : lastVisibleDay;

    const barStartColumnIndex = differenceInCalendarDays(
      barStartDay,
      firstVisibleDay,
    );

    const barEndColumnIndex = differenceInCalendarDays(
      barEndDay,
      firstVisibleDay,
    );

    const isSingleDayVacation = barStartColumnIndex === barEndColumnIndex;

    const columnStart = barStartColumnIndex + 1;
    const columnEnd = barEndColumnIndex + 2;
    const daySpan = columnEnd - columnStart;

    const barLabel =
      isSingleDayVacation || daySpan <= 2
        ? formatUserName(user.name)
        : formatTimelineBarName(user.name);

    return [
      {
        key: `${user.id}-${vacationIndex}`,
        columnStart,
        columnEnd,
        isSingleDay: isSingleDayVacation,
        label: barLabel,
        fullName: user.name,
      },
    ];
  });
}
