import type { UserStatusType } from "@/types/User";
import { userStatusMap } from "@/types/UserStatusMap";
import css from "./Avatar.module.css";

type AvatarPropsType = {
  name: string;
  status?: UserStatusType;
  showStatus?: boolean;
  statusColor?: string;
  size?: 28 | 36;
};

const Avatar = ({
  name,
  status,
  showStatus = false,
  statusColor: statusColorOverride,
  size = 36,
}: AvatarPropsType) => {
  const getInitials = (fullName: string): string => {
    const trimmed = fullName.trim();
    if (trimmed.length === 0) return "";
    return trimmed.charAt(0).toUpperCase();
  };

  const initials = getInitials(name);
  const statusColor =
    statusColorOverride ??
    (showStatus && status ? userStatusMap[status]?.color : undefined);

  return (
    <div
      className={size === 28 ? css.avatarSmall : css.avatar}
      style={statusColor ? { border: `5px solid ${statusColor}` } : undefined}
    >
      <span className={css.initials}>{initials}</span>
    </div>
  );
};

export default Avatar;
