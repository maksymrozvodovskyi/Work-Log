import { useMemo } from "react";
import type { UserType, ProjectType } from "@/types/Project";
import type { TimelineDateItem, ProjectPosition } from "@/features/projects/types/timeline";
import css from "@/features/projects/index.module.css";
import { TimelineDateCell } from "../TimelineDateCell";
import { TimelineProjectBar } from "../TimelineProjectBar";

type TimelineRowProps = {
  user: UserType;
  userIndex: number;
  timelineDates: TimelineDateItem[];
  projects: ProjectType[];
  getProjectPosition: (project: ProjectType) => ProjectPosition | null;
};

export const TimelineRow = ({
  user,
  userIndex,
  timelineDates,
  projects,
  getProjectPosition,
}: TimelineRowProps) => {
  const { rowNumber, userProjectsWithPosition } = useMemo(() => {
    const row = userIndex + 2;
    const userProjects = projects
      .filter((project) =>
        project.users.some((projectUser) => projectUser.id === user.id)
      )
      .map((project) => {
        const position = getProjectPosition(project);
        return position ? { project, position } : null;
      })
      .filter((item): item is { project: ProjectType; position: ProjectPosition } => item !== null);
    
    return { rowNumber: row, userProjectsWithPosition: userProjects };
  }, [projects, user.id, userIndex, getProjectPosition]);

  return (
    <div className={css.timelineUserRow}>
      {timelineDates.map((dateItem, dateIndex) => (
        <TimelineDateCell
          key={`user-${user.id}-date-${dateIndex}`}
          dateItem={dateItem}
          index={dateIndex}
          rowNumber={rowNumber}
        />
      ))}

      {userProjectsWithPosition.map(({ project, position }) => (
        <TimelineProjectBar
          key={`project-${project.id}-user-${user.id}`}
          project={project}
          position={position}
          rowNumber={rowNumber}
        />
      ))}
    </div>
  );
};

