import type { ProjectStatus } from "./Project";
import type { StatusInfo } from "./StatusInfo";

export const statusMap: Record<ProjectStatus, StatusInfo> = {
  PLANNED: { label: "Planned", color: "#94a3b8" },
  INPROGRESS: { label: "In progress", color: "#22c55e" },
  ONHOLD: { label: "On hold", color: "#f59e0b" },
  COMPLETED: { label: "Completed", color: "#10b981" },
  CANCELLED: { label: "Cancelled", color: "#ef4444" },
  SUPPORT: { label: "Support", color: "#3b82f6" },
};
