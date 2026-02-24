import type { ActivityType, HoursFilterType } from "@/types/Report";

export const ACTIVITY_ORDER: ActivityType[] = [
  "CODING",
  "REVIEW",
  "STUDING",
  "SICKLEAVE",
  "VACATION",
  "WITHOUT_REPORT",
];

export const SCHEMA_ACTIVITY_ORDER: ActivityType[] = [
  "CODING",
  "REVIEW",
  "STUDING",
  "SICKLEAVE",
  "VACATION",
];

export const HOURS_OPTIONS: { value: HoursFilterType; label: string }[] = [
  { value: "LT_8", label: "<8h" },
  { value: "EQ_8", label: "8h" },
  { value: "GT_8", label: ">8h" },
];

export const REPORTS_PER_PAGE = 20;
