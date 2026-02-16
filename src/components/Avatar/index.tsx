import type { UserStatusType } from "@/types/User";
import { userStatusMap } from "@/types/UserStatusMap";
import css from "./Avatar.module.css";

type AvatarPropsType = {
  name: string;
  status: UserStatusType;
  showStatus?: boolean;
};

const Avatar = ({ name, status, showStatus = false }: AvatarPropsType) => {
  const getInitials = (fullName: string): string => {
    const trimmed = fullName.trim();
    if (trimmed.length === 0) return "";
    return trimmed.charAt(0).toUpperCase();
  };

  const initials = getInitials(name);
  const statusColor = showStatus ? userStatusMap[status]?.color : undefined;

  return (
    <div
      className={css.avatar}
      style={statusColor ? { border: `5px solid ${statusColor}` } : undefined}
      aria-label={`Avatar for ${name}`}
    >
      <span className={css.initials}>{initials}</span>
    </div>
  );
};

export default Avatar;
