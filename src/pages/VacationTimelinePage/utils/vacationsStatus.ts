import { isBefore, isSameDay, addDays } from "date-fns";

type Range = {
  startDate: Date;
  endDate: Date;
  days: number;
};

export function groupDateRanges(dates: Date[]): Range[] {
  if (dates.length === 0) return [];

  const arrayOfDates = [...dates];

  const sorted = arrayOfDates.sort((a, b) => a.getTime() - b.getTime());

  const ranges: Range[] = [];

  for (const date of sorted) {
    const lastRange = ranges[ranges.length - 1];

    if (!lastRange) {
      ranges.push({ startDate: date, endDate: date, days: 1 });
    } else {
      const dayAfterLastRange = addDays(lastRange.endDate, 1);

      const isNextDay = isSameDay(dayAfterLastRange, date);

      if (isNextDay) {
        lastRange.endDate = date;

        lastRange.days += 1;
      } else {
        ranges.push({ startDate: date, endDate: date, days: 1 });
      }
    }
  }

  return ranges;
}

export function getUserVacationStatus(workLogs: { date: string }[]) {
  const today = new Date();

  const stats = {
    used: [] as Date[],
    active: [] as Date[],
    future: [] as Date[],
  };

  for (const log of workLogs) {
    const logDate = new Date(log.date);

    if (isBefore(logDate, today)) {
      stats.used.push(logDate);
    } else if (isSameDay(logDate, today)) {
      stats.active.push(logDate);
    } else {
      stats.future.push(logDate);
    }
  }

  const vacationStats = {
    used: groupDateRanges(stats.used),
    active: groupDateRanges(stats.active),
    future: groupDateRanges(stats.future),
  };

  return vacationStats;
}
