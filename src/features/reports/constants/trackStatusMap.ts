import { ActivityTypeValues, type ActivityType } from "@/types/WorkLog";
import { ACTIVITY_COLOR_MAP } from "@/features/worklogs/constants/activityColors";

export const TRACK_STATUS_ORDER: ActivityType[] = [
  ActivityTypeValues.CODING,
  ActivityTypeValues.VACATION,
  ActivityTypeValues.REVIEW,
  ActivityTypeValues.SICKLEAVE,
  ActivityTypeValues.STUDING,
];

export type TrackStatusInfo = {
  label: string;
  color: string;
};

export const trackStatusMap: Record<ActivityType, TrackStatusInfo> = {
  [ActivityTypeValues.CODING]: {
    label: "Coding",
    color: ACTIVITY_COLOR_MAP[ActivityTypeValues.CODING],
  },
  [ActivityTypeValues.REVIEW]: {
    label: "Review",
    color: ACTIVITY_COLOR_MAP[ActivityTypeValues.REVIEW],
  },
  [ActivityTypeValues.STUDING]: {
    label: "Studing",
    color: ACTIVITY_COLOR_MAP[ActivityTypeValues.STUDING],
  },
  [ActivityTypeValues.SICKLEAVE]: {
    label: "Sick leave",
    color: ACTIVITY_COLOR_MAP[ActivityTypeValues.SICKLEAVE],
  },
  [ActivityTypeValues.VACATION]: {
    label: "Vacation",
    color: ACTIVITY_COLOR_MAP[ActivityTypeValues.VACATION],
  },
};
