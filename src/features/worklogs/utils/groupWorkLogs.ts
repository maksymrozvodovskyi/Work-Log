import type { WorkLogsByTimeResponseType, ActivityType } from "@/types/WorkLog";
import { ActivityTypeValues } from "@/types/WorkLog";

export type DateGroupedWorkLogType = {
  date: string;
  totalHours: number;
  projects: string[];
};

export type ProjectGroupedWorkLogType = {
  projectId: string;
  projectName: string;
  totalHours: number;
};

export type WorkLogByDateWithActivityType = {
  date: string;
  activities: Map<ActivityType | string, number>;
  hasWorkHours: boolean;
  primaryActivity: ActivityType | string | null;
};

export const groupWorkLogsByDate = (
  data: WorkLogsByTimeResponseType | undefined
): DateGroupedWorkLogType[] => {
  if (!data || !data.projects) {
    return [];
  }

  const dateMap = new Map<string, { totalHours: number; projects: Set<string> }>();

  data.projects.forEach((projectItem) => {
    projectItem.logs.forEach((log) => {
      if (!log.project || !log.project.name) {
        return;
      }

      const projectName = log.project.name;
      const dateKey = log.date.split('T')[0];
      
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { totalHours: 0, projects: new Set() });
      }

      const dateEntry = dateMap.get(dateKey)!;
      dateEntry.totalHours += log.hours;
      dateEntry.projects.add(projectName);
    });
  });

  const result: DateGroupedWorkLogType[] = Array.from(dateMap.entries())
    .map(([date, { totalHours, projects }]) => ({
      date,
      totalHours,
      projects: Array.from(projects).sort(),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return result;
};

export const groupWorkLogsByProject = (
  data: WorkLogsByTimeResponseType | undefined,
  selectedProjectIds: Set<string> | undefined
): ProjectGroupedWorkLogType[] => {
  if (!data || !data.projects) {
    return [];
  }

  const projectMap = new Map<string, { projectName: string; totalHours: number }>();

  data.projects.forEach((projectItem) => {
    projectItem.logs.forEach((log) => {
      const project = log.project || projectItem.project;
      
      if (!project || !project.id || !project.name) {
        return;
      }

      if (
        log.hours === 0 &&
        (log.activity === ActivityTypeValues.VACATION ||
          log.activity === ActivityTypeValues.SICKLEAVE)
      ) {
        return;
      }

      const projectId = project.id;
      const projectName = project.name;

    if (selectedProjectIds && selectedProjectIds.size > 0) {
      if (!selectedProjectIds.has(projectId)) {
        return;
      }
    }

    if (!projectMap.has(projectId)) {
      projectMap.set(projectId, { projectName, totalHours: 0 });
    }

    const projectEntry = projectMap.get(projectId)!;
      projectEntry.totalHours += log.hours;
    });
  });

  const result: ProjectGroupedWorkLogType[] = Array.from(projectMap.entries())
    .map(([projectId, { projectName, totalHours }]) => ({
      projectId,
      projectName,
      totalHours,
    }))
    .filter((item) => item.totalHours > 0)
    .sort((a, b) => a.projectName.localeCompare(b.projectName));

  return result;
};

export const getWorkLogsByDateWithActivity = (
  data: WorkLogsByTimeResponseType | undefined
): Map<string, WorkLogByDateWithActivityType> => {
  const dateMap = new Map<string, WorkLogByDateWithActivityType>();

  if (!data || !data.projects) {
    return dateMap;
  }

  data.projects.forEach((projectItem) => {
    projectItem.logs.forEach((log) => {
      const dateKey = log.date.split('T')[0];
      
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          activities: new Map(),
          hasWorkHours: false,
          primaryActivity: null,
        });
      }

      const dateEntry = dateMap.get(dateKey)!;
      const currentHours = dateEntry.activities.get(log.activity) || 0;
      dateEntry.activities.set(log.activity, currentHours + log.hours);
      
      if (log.hours > 0) {
        dateEntry.hasWorkHours = true;
      }
    });
  });

  dateMap.forEach((dateEntry) => {
    if (!dateEntry.hasWorkHours) {
      return;
    }

    let maxHours = 0;
    let primaryActivity: ActivityType | string | null = null;

    dateEntry.activities.forEach((hours, activity) => {
      if (hours > 0 && hours > maxHours) {
        maxHours = hours;
        primaryActivity = activity;
      }
    });

    dateEntry.primaryActivity = primaryActivity;
  });

  return dateMap;
};

