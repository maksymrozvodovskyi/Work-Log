export type YearCell = {
  label: string;
  usedDays: number;
  remainingDays: number;
};

export type VacationDetailsModalData = {
  userId: string;
  userName: string;
  years: YearCell[];
  usedDays: number;
  remainingDays: number;
  workStart: { date: string };
};
