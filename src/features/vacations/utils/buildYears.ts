import { YEARS_COUNT } from "@/features/vacations/constants";

export function buildYears(now: Date) {
  const years: number[] = [];
  const startYear = now.getFullYear() - (YEARS_COUNT - 1);

  for (let i = 0; i < YEARS_COUNT; i++) {
    years.push(startYear + i);
  }

  return years;
}
