import { format } from "date-fns";
import type { VacationRange } from "../types/vacations";

export function formatVacationRange(range: VacationRange): string {
  return `${range.days}d, ${format(range.startDate, "dd.MM.yyyy")} - ${format(range.endDate, "dd.MM.yyyy")}`;
}