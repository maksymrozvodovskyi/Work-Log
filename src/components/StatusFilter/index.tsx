import css from "./StatusFilter.module.css";
import type { StatusInfo } from "@/types/StatusInfo";
import CheckmarkIcon from "@/features/projects/svg/CheckmarkIcon";

type StatusFilterProps<T extends string> = {
  statusOrder: T[];
  statusMap: Record<T, StatusInfo>;
  selectedStatus?: T | null;
  onStatusChange: (status: T | null) => void;
  entityType?: string;
};

const StatusFilter = <T extends string>({
  statusOrder,
  statusMap,
  selectedStatus,
  onStatusChange,
  entityType = "items",
}: StatusFilterProps<T>) => {
  const handleStatusClick = (status: T) => {
    if (selectedStatus === status) {
      onStatusChange(null);
    } else {
      onStatusChange(status);
    }
  };

  return (
    <div className={css.statusCircles}>
      {statusOrder.map((status) => {
        const statusInfo = statusMap[status];
        if (!statusInfo) return null;

        const isSelected = selectedStatus === status;

        return (
          <button
            key={status}
            type="button"
            className={css.statusCircle}
            aria-label={`Filter by ${statusInfo.label.toLowerCase()} ${entityType}`}
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
