import css from "@/components/StatusFilter.module.css";
import type { ProjectStatus } from "@/types/Project";
import { statusMap } from "@/types/StatusMap";
import { PROJECT_STATUS_ORDER } from "@/features/projects/constants/projectStatusOrder";
import CheckmarkIcon from "@/features/projects/svg/CheckmarkIcon";

type StatusFilterProps = {
  selectedStatus?: ProjectStatus | null;
  onStatusChange: (status: ProjectStatus | null) => void;
};

const StatusFilter = ({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) => {
  const handleStatusClick = (status: ProjectStatus) => {
    if (selectedStatus === status) {
      onStatusChange(null);
    } else {
      onStatusChange(status);
    }
  };

  return (
    <div className={css.statusCircles}>
      {PROJECT_STATUS_ORDER.map((status) => {
        const statusInfo = statusMap[status];
        if (!statusInfo) return null;

        const isSelected = selectedStatus === status;

        return (
          <button
            key={status}
            type="button"
            className={css.statusCircle}
            aria-label={`Filter by ${statusInfo.label.toLowerCase()} projects`}
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

export default StatusFilter;
