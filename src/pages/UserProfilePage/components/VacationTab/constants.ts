import type { StatusInfoType } from "@/types/StatusInfo";

export const VACATION_ACTIVITY_TYPES: string[] = ["VACATION", "SICKLEAVE"];

export const VACATION_TYPE_MAP: Record<"VACATION" | "SICKLEAVE", StatusInfoType> = {
  VACATION: { label: "Vacation", color: "#FF6B9D" },
  SICKLEAVE: { label: "Sick leave", color: "#4A90E2" },
} as const;
