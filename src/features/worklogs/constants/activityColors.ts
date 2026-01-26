import { ActivityTypeValues, type ActivityType } from "@/types/WorkLog";

export const ACTIVITY_COLOR_MAP: Record<
  Exclude<ActivityType, typeof ActivityTypeValues.VACATION>,
  string
> = {
  [ActivityTypeValues.CODING]: "#22c55e", 
  [ActivityTypeValues.REVIEW]: "#3b82f6", 
  [ActivityTypeValues.STUDING]: "#8b5cf6", 
  [ActivityTypeValues.SICKLEAVE]: "#4A90E2",
};

