import clsx from "clsx";
import CalendarIcon from "@/components/svg/CalendarIcon";
import css from "./PeriodInput.module.css";

type PeriodInputPropsType = {
  type: "start" | "end";
  value: string;
  placeholder: string;
  isActive: boolean;
  onClick: () => void;
};

const PeriodInput = ({
  type,
  value,
  placeholder,
  isActive,
  onClick,
}: PeriodInputPropsType) => (
  <div className={css.periodInputWrapper} onClick={onClick}>
    <input
      type="text"
      className={clsx(css.periodInput, isActive && css.periodInputActive)}
      placeholder={placeholder}
      value={value}
      readOnly
    />
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={css.calendarIconButton}
      aria-label={`Select ${type} date`}
    >
      <CalendarIcon />
    </button>
  </div>
);

export default PeriodInput;

