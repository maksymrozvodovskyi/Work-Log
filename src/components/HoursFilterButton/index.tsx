import type React from "react";
import StatusFilterCheckIcon from "@/components/svg/StatusFilterCheckIcon";
import StatusFilterCircleIcon from "@/components/svg/StatusFilterCircleIcon";
import css from "@/features/reports/index.module.css";

type HoursFilterButtonProps = {
  label: React.ReactNode;
  disabled: boolean;
  selected: boolean;
  onClick: () => void;
};

const HoursFilterButton = ({
  label,
  disabled,
  selected,
  onClick,
}: HoursFilterButtonProps) => (
  <button
    type="button"
    className={css.hoursFilterItem}
    onClick={onClick}
    disabled={disabled}
  >
    <span className={css.hoursFilterCheckbox}>
      {selected ? <StatusFilterCheckIcon /> : <StatusFilterCircleIcon />}
    </span>
    <span className={css.hoursFilterLabel}>
      {label}
    </span>
  </button>
);

export default HoursFilterButton;