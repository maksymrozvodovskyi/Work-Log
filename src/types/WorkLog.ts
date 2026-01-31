export const ActivityTypeValues = {
  CODING: "CODING",
  REVIEW: "REVIEW",
  STUDING: "STUDING",
  SICKLEAVE: "SICKLEAVE",
  VACATION: "VACATION",
} as const;

export type ActivityType = typeof ActivityTypeValues[keyof typeof ActivityTypeValues];

export type WorkLogType = {
  date: string;
  hours: number;
  activity: ActivityType | string;
  project: {
    id: string;
    name: string;
  } | null;
};

export type ProjectWorkLogType = {
  project: {
    id: string;
    name: string;
  } | null;
  logs: WorkLogType[];
};

export type WorkLogsByTimeResponseType = {
  projects: ProjectWorkLogType[];
};

