import { useCallback } from "react";
import clsx from "clsx";
import css from "./ToggleSwitch.module.css";

type ToggleSwitchPropsType = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  disabled?: boolean;
};

const ToggleSwitch = ({ checked, onChange, ariaLabel, disabled = false }: ToggleSwitchPropsType) => {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [disabled, checked, onChange]);

  return (
    <button
      type="button"
      className={clsx(css.toggle, checked && css.toggleChecked, disabled && css.toggleDisabled)}
      onClick={handleToggle}
      aria-label={ariaLabel}
      aria-pressed={checked}
      disabled={disabled}
    >
      <span className={clsx(css.toggleThumb, checked && css.toggleThumbChecked)} />
    </button>
  );
};

export default ToggleSwitch;

