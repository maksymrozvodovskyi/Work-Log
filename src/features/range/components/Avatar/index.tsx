import type { UserStatusType } from "@/types/User";
import { userStatusMap } from "@/types/UserStatusMap";
import css from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  status: UserStatusType;
}

const Avatar = ({ name, status }: AvatarProps) => {
  const getInitials = (fullName: string): string => {
    const trimmed = fullName.trim();
    if (trimmed.length === 0) return "";
    return trimmed.charAt(0).toUpperCase();
  };

  const statusColor = userStatusMap[status]?.color || "#94a3b8";
  const initials = getInitials(name);

  return (
    <div
      className={css.avatar}
      style={{ borderColor: statusColor }}
      aria-label={`Avatar for ${name}`}
    >
      <span className={css.initials}>{initials}</span>
    </div>
  );
};

export default Avatar;
