import type { UserStatus } from "./User";
import type { StatusInfo } from "./StatusInfo";

export const userStatusMap: Record<UserStatus, StatusInfo> = {
  RED: { label: "Red", color: "#ef4444" },
  YELLOW: { label: "Yellow", color: "#f59e0b" },
  GREEN: { label: "Green", color: "#22c55e" },
  CLEAN: { label: "Clean", color: "#94a3b8" },
  ARCHIVED: { label: "Archived", color: "#6b7682" },
};
