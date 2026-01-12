import { useState, Activity } from "react";
import clsx from "clsx";
import ArrowIcon from "@/features/projects/svg/ArrowIcon";
import { useClickOutside } from "@/hooks/useClickOutside";
import css from "@/features/range/index.module.css";

interface DropdownFilterProps {
  label: string;
  options: string[];
  selectedValue?: string | null;
  onSelect: (value: string | null) => void;
  placeholder?: string;
}

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "All",
}: DropdownFilterProps) => {
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
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Filter by ${label}`}
        aria-expanded={isOpen}
      >
        <span>{displayValue}</span>
        <ArrowIcon
          className={clsx(css.dropdownArrow, isOpen && css.dropdownArrowOpen)}
        />
      </button>

      <Activity mode={isOpen ? "visible" : "hidden"}>
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
      </Activity>
    </div>
  );
};

export default DropdownFilter;
