import { format, isToday, differenceInCalendarDays, parseISO, isPast } from "date-fns";

export const formatDateDisplay = (date: Date | null): string => {
  if (!date) return '';
  
  if (isToday(date)) {
    return 'Today';
  }
  
  return format(date, 'dd.MM.yyyy');
};

export const formatDateForApi = (date: Date | null): string | null => {
  if (!date) return null;
  return format(date, 'yyyy-MM-dd');
};

export type VacationPeriod = {
  startDate: Date;
  endDate: Date;
  days: number;
  activity: string;
  type: "VACATION" | "SICKLEAVE";
};

export const groupConsecutiveDates = (workLogs: Array<{ date: string; activity: string }>): VacationPeriod[] => {
  if (workLogs.length === 0) return [];

  const sorted = [...workLogs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const periods: VacationPeriod[] = [];
  let currentPeriod: VacationPeriod | null = null;

  for (const log of sorted) {
    const logDate = parseISO(log.date);
    const activityType = log.activity === "VACATION" ? "VACATION" : "SICKLEAVE";

    if (!currentPeriod) {
      currentPeriod = {
        startDate: logDate,
        endDate: logDate,
        days: 1,
        activity: log.activity,
        type: activityType,
      };
    } else if (
      currentPeriod.type === activityType &&
      differenceInCalendarDays(logDate, currentPeriod.endDate) === 1
    ) {
      currentPeriod.endDate = logDate;
      currentPeriod.days += 1;
    } else {
      periods.push(currentPeriod);
      currentPeriod = {
        startDate: logDate,
        endDate: logDate,
        days: 1,
        activity: log.activity,
        type: activityType,
      };
    }
  }

  if (currentPeriod) {
    periods.push(currentPeriod);
  }

  return periods;
};

export const getVacationStatus = (startDate: Date, endDate: Date): "Used" | "Active" => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (isPast(end) && end < today) {
    return "Used";
  }

  return "Active";
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = format(startDate, "dd.MM.yyyy");
  const end = format(endDate, "dd.MM.yyyy");
  return start === end ? start : `${start} - ${end}`;
};

export const formatDateOfBirth = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  try {
    return format(parseISO(dateString), "dd.MM.yyyy");
  } catch {
    return dateString;
  }
};

