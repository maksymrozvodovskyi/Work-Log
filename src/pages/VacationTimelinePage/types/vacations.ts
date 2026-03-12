export type VacationRange = {
  startDate: Date;
  endDate: Date;
  days: number;
};

export type VacationStats = {
  used: VacationRange[];
  active: VacationRange[];
  future: VacationRange[];
};
