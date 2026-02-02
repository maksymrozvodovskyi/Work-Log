import { createContext } from "react";
import type { ProjectType, UserType } from "@/types/Project";
import type { TimelineDateItem } from "@/features/projects/types/timeline";

export type MonthBounds = {
  start: Date;
  end: Date;
};

export type TimelineContextType = {
  projects: ProjectType[];
  users: UserType[];
  timelineDates: TimelineDateItem[];
  currentDate: Date;
  monthBounds: MonthBounds;
  todayDate: Date;
  isLoadingUsers: boolean;
};

export const TimelineContext = createContext<TimelineContextType | null>(null);

