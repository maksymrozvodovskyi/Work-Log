import { ActivityTypeValues } from "@/types/WorkLog";
import { ACTIVITY_COLOR_MAP } from "@/features/worklogs/constants/activityColors";
import type { ReportType } from "@/api/reports";

export const REPORT_TYPE_COLOR_MAP: Record<
  Exclude<ReportType, "missed">,
  string
> = {
  work: ACTIVITY_COLOR_MAP[ActivityTypeValues.CODING],
  special: ACTIVITY_COLOR_MAP[ActivityTypeValues.SICKLEAVE],
  overtime: ACTIVITY_COLOR_MAP[ActivityTypeValues.REVIEW],
};

export const REPORT_TYPES: Exclude<ReportType, "missed">[] = [
  "work",
  "special",
  "overtime",
];
