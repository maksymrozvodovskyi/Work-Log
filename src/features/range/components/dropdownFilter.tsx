import { useState, useRef, useEffect } from "react";
import ArrowDownIcon from "../../projects/svg/ArrowDownIcon";
import css from "../index.module.css";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
        <ArrowDownIcon
          className={`${css.dropdownArrow} ${
            isOpen ? css.dropdownArrowOpen : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className={css.dropdownMenu}>
          <button
            type="button"
            className={`${css.dropdownItem} ${
              !selectedValue ? css.dropdownItemActive : ""
            }`}
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
              className={`${css.dropdownItem} ${
                selectedValue === option ? css.dropdownItemActive : ""
              }`}
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
