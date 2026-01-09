import css from "../../../components/StatusFilter.module.css";
import type { UserStatus } from "../../../types/User";
import { userStatusMap } from "../../../types/UserStatusMap";
import { USER_STATUS_ORDER } from "../../../types/UserStatusOrder";
import CheckmarkIcon from "../../projects/svg/CheckmarkIcon";

type UserStatusFilterProps = {
  selectedStatus?: UserStatus | null;
  onStatusChange: (status: UserStatus | null) => void;
};

const UserStatusFilter = ({
  selectedStatus,
  onStatusChange,
}: UserStatusFilterProps) => {
  const handleStatusClick = (status: UserStatus) => {
    if (selectedStatus === status) {
      onStatusChange(null);
    } else {
      onStatusChange(status);
    }
  };

  return (
    <div className={css.statusCircles}>
      {USER_STATUS_ORDER.map((status) => {
        const statusInfo = userStatusMap[status];
        if (!statusInfo) return null;

        const isSelected = selectedStatus === status;

        return (
          <button
            key={status}
            type="button"
            className={css.statusCircle}
            aria-label={`Filter by ${statusInfo.label.toLowerCase()} users`}
            onClick={() => handleStatusClick(status)}
            style={{ backgroundColor: statusInfo.color }}
          >
            {isSelected && <CheckmarkIcon />}
          </button>
        );
      })}
    </div>
  );
};

export default UserStatusFilter;
