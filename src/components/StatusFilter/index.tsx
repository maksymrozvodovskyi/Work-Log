import css from "./StatusFilter.module.css";
import type { StatusInfoType } from "@/types/StatusInfo";
import StatusFilterCheckIcon from "@/components/svg/StatusFilterCheckIcon";

type StatusFilterPropsType<T extends string> = {
  statusOrder: T[];
  statusMap: Record<T, StatusInfoType>;
  selectedStatus?: T | null;
  onStatusChange: (status: T | null) => void;
  entityType?: string;
  disabled?: boolean;
};

const StatusFilter = <T extends string>({
  statusOrder,
  statusMap,
  selectedStatus,
  onStatusChange,
  entityType = "items",
  disabled = false,
}: StatusFilterPropsType<T>) => {
  const handleStatusClick = (status: T) => {
    if (disabled) return;
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
            disabled={disabled}
          >
            {isSelected && <StatusFilterCheckIcon />}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
