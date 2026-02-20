import { parseISO, format } from "date-fns";
import { getRoleLabel } from "@/utils/userTransformers";
import type { UserRangeType } from "@/types/User";
import type { ReportType } from "@/api/reports";

export const REPORT_LABELS: Record<ReportType, string> = {
  missed: "Missed reports",
  work: "Work on project",
  special: "Special",
  overtime: "Overtime",
};

export const REPORT_TYPES = Object.keys(REPORT_LABELS) as ReportType[];

export const getRoleOrSkill = (user: UserRangeType): string => {
  if (user.skills && user.skills.length > 0) return user.skills[0];

  if (user.userType) return getRoleLabel(user.userType);

  return "—";
};

export const formatWorkDetails = (user: UserRangeType): string => {
  const project = user.mainProject ?? "—";

  const hours = user.totalHours ?? 0;

  return `${project} ${hours}h`;
};

export const formatVacationDateRange = (
  startDate: string,
  endDate: string,
): string => {
  const start = format(parseISO(startDate), "dd.MM.yyyy");

  const end = format(parseISO(endDate), "dd.MM.yyyy");

  return `${start} – ${end}`;
};

export const getSpecialStatusLabel = (
  specialType?: UserRangeType["specialType"],
): string => {
  if (specialType === "VACATION") return "Vacation";

  if (specialType === "SICKLEAVE") return "Sick leave";
  return "Special";
};

export type ReportCardStatusKey = "work" | "vacation" | "sickleave" | "special";

const isWorkOrOvertime = (type: ReportType) =>
  type === "work" || type === "overtime";

export const getCardStatus = (
  user: UserRangeType,
  reportType: ReportType,
): { label: string; statusKey?: ReportCardStatusKey } => {
  if (reportType === "special") {
    let statusKey: ReportCardStatusKey;

    if (user.specialType === "VACATION") {
      statusKey = "vacation";
    } else if (user.specialType === "SICKLEAVE") {
      statusKey = "sickleave";
    } else {
      statusKey = "special";
    }
    return {
      label: getSpecialStatusLabel(user.specialType),
      statusKey,
    };
  }
  if (isWorkOrOvertime(reportType)) {
    return { label: "Work on project", statusKey: "work" };
  }
  return { label: REPORT_LABELS[reportType] };
};
