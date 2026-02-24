import StatusFilterCheckIcon from "@/components/svg/StatusFilterCheckIcon";
import StatusFilterCircleIcon from "@/components/svg/StatusFilterCircleIcon";
import css from "@/features/reports/index.module.css";
import { activityStatusMap } from "@/types/Report";
import type { ActivityType } from "@/types/Report";

type ActivityFilterButtonProps = {
  activity: ActivityType;
  disabled: boolean;
  selected: boolean;
  onClick: () => void;
};

const ActivityFilterButton = ({
  activity,
  disabled,
  selected,
  onClick,
}: ActivityFilterButtonProps) => {
  const info = activityStatusMap[activity];
  const label = info?.label ?? activity;
  const labelStyle = { color: info?.color };

  return (
    <button
      type="button"
      className={css.activityFilterItem}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={css.activityFilterCheckbox}>
        {selected ? <StatusFilterCheckIcon /> : <StatusFilterCircleIcon />}
      </span>
      <span className={css.activityFilterLabel} style={labelStyle}>
        {label}
      </span>
    </button>
  );
};

export default ActivityFilterButton;