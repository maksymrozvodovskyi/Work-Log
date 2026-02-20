import type { UserRangeType, UserStatusType } from "@/types/User";
import type { UserRoleType, UserType } from "@/types/Project";

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
  skype?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  location?: string | null;
  skills?: string[] | null;
  totalHours?: number | null;
  specialType?: "VACATION" | "SICKLEAVE";
  vacationPeriod?: { days: number; startDate: string; endDate: string };
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
    skills: user.skills ?? null,
    totalHours: user.totalHours ?? null,
    specialType: user.specialType,
    vacationPeriod: user.vacationPeriod,
  };
};

export const getRoleLabel = (role: UserType["role"]): string => {
  if (role === "ADMIN") return "Admin";
  if (role === "EMPLOYEE") return "Employee";
  return role || "";
};
