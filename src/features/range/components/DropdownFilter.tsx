import { useState } from "react";
import clsx from "clsx";
import ArrowIcon from "@/components/svg/ArrowIcon";
import { useClickOutside } from "@/hooks/useClickOutside";
import css from "@/features/range/index.module.css";

type DropdownFilterPropsType = {
  label: string;
  options: string[];
  selectedValue?: string | null;
  onSelect: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "All",
  disabled = false,
}: DropdownFilterPropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(
    () => setIsOpen(false),
    isOpen
  );

  const displayValue = selectedValue || placeholder;

  return (
    <div className={css.dropdownWrapper} ref={dropdownRef}>
      <button
        type="button"
        className={css.dropdownButton}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-label={`Filter by ${label}`}
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span>{displayValue}</span>
        <ArrowIcon
          className={clsx(css.dropdownArrow, isOpen && css.dropdownArrowOpen)}
        />
      </button>

      {isOpen && (
        <div className={css.dropdownMenu}>
          <button
            type="button"
            className={clsx(
              css.dropdownItem,
              !selectedValue && css.dropdownItemActive
            )}
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={clsx(
                css.dropdownItem,
                selectedValue === option && css.dropdownItemActive
              )}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
