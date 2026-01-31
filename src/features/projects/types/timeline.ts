export type TimelineDateItem = {
  dayOfWeek: string;
  dayNumber: string;
  fullDate: Date;
  isWeekend: boolean;
  nextIsWeekend: boolean | null;
  prevIsWeekend?: boolean;
  isMonthLabel: boolean;
  monthName?: string;
};

export type ProjectPosition = {
  start: number;
  end: number;
};

export type StatisticItemType = {
  value: number;
  label: string;
  isMain?: boolean;
};

