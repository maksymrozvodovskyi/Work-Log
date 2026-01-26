import { format } from "date-fns";
import type { WorkLogsByTimeResponseType } from "@/types/WorkLog";
import { ActivityTypeValues } from "@/types/WorkLog";
import { ACTIVITY_COLOR_MAP } from "@/features/worklogs/constants/activityColors";
import css from "./ActivityCard.module.css";

type ActivityCardPropsType = {
  selectedDate: Date | null;
  workLogsData?: WorkLogsByTimeResponseType;
};

const formatActivityName = (activity: string): string => {
  const activityMap: Record<string, string> = {
    [ActivityTypeValues.CODING]: "Coding",
    [ActivityTypeValues.REVIEW]: "Review",
    [ActivityTypeValues.STUDING]: "Studing",
    [ActivityTypeValues.SICKLEAVE]: "Sick Leave",
    [ActivityTypeValues.VACATION]: "Vacation",
  };
  return activityMap[activity] || activity;
};

const getActivityColor = (activity: string): string => {
  if (
    activity === ActivityTypeValues.VACATION ||
    activity === ActivityTypeValues.SICKLEAVE
  ) {
    return ACTIVITY_COLOR_MAP[ActivityTypeValues.SICKLEAVE] || "#4A90E2";
  }
  return ACTIVITY_COLOR_MAP[activity as keyof typeof ACTIVITY_COLOR_MAP] || "#aeb8c2";
};

type ProjectActivities = {
  projectName: string;
  activities: Array<{ activity: string; hours: number }>;
};

export const ActivityCard = ({
  selectedDate,
  workLogsData,
}: ActivityCardPropsType) => {
  if (!selectedDate || !workLogsData) {
    return null;
  }

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const projectsMap = new Map<string, Map<string, number>>();

  workLogsData.projects?.forEach((projectItem) => {
    const projectName = projectItem.project?.name || "No Project";
    
    projectItem.logs.forEach((log) => {
      const logDateKey = log.date.split("T")[0];
      if (logDateKey === dateKey && log.hours > 0) {
        if (!projectsMap.has(projectName)) {
          projectsMap.set(projectName, new Map());
        }
        
        const projectActivities = projectsMap.get(projectName)!;
        const currentHours = projectActivities.get(log.activity) || 0;
        projectActivities.set(log.activity, currentHours + log.hours);
      }
    });
  });

  if (projectsMap.size === 0) {
    return null;
  }

  const projects: ProjectActivities[] = Array.from(projectsMap.entries()).map(
    ([projectName, activitiesMap]) => ({
      projectName,
      activities: Array.from(activitiesMap.entries()).map(([activity, hours]) => ({
        activity,
        hours,
      })),
    })
  );

  return (
    <div className={css.activityCard}>
      {projects.map((project, projectIndex) => (
        <div key={projectIndex} className={css.projectSection}>
          <div className={css.projectName}>{project.projectName}</div>
          <div className={css.activitiesList}>
            {project.activities.map(({ activity, hours }, activityIndex) => (
              <span key={activityIndex}>
                <span
                  className={css.activityText}
                  style={{ color: getActivityColor(activity) }}
                >
                  {formatActivityName(activity)}
                </span>
                <span className={css.activityHours}> - {hours}h</span>
                {activityIndex < project.activities.length - 1 && (
                  <span className={css.activitySeparator}>, </span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

