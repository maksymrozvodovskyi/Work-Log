import type { UserRangeType, UserStatusType } from "@/types/User";
import type { UserRoleType } from "@/types/Project";

export type ApiProjectType = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
};

export type ApiUserType = {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
  createdAt: string;
  projects: ApiProjectType[];
  status?: UserStatusType;
};

export const transformApiUserToUserRange = (
  user: ApiUserType,
  status?: UserStatusType
): UserRangeType => {
  const projectNames = (user.projects || []).map((p) => p.name);
  const mainProject = projectNames.length > 0 ? projectNames[0] : null;
  const otherProjects = projectNames.length > 1 ? projectNames.slice(1) : [];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    mainProject,
    otherProjects,
    status: user.status || status || "GREEN",
    userType: user.role,
  };
};
