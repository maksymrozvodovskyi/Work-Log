export type ActivityType = string;

export type WorkLogType = {
  id: string;
  userId: string;
  projectId: string;
  date: string; // ISO date string
  hours: number;
  activity: ActivityType;
  project: {
    id: string;
    name: string;
  };
};

export type WorkLogsByTimeResponseType = {
  userId: string;
  totalUserHours: number;
  projects: Array<{
    project: {
      id: string;
      name: string;
    };
    totalHours: number;
    logs: WorkLogType[];
  }>;
};









