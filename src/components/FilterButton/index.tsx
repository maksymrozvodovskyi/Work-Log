import clsx from "clsx";
import css from "./FilterButton.module.css";
import FilterIcon from "@/components/svg/FilterIcon";

type FilterButtonPropsType = {
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
};

const FilterButton = ({ onClick, className, disabled = false }: FilterButtonPropsType) => {
  return (
    <button
      type="button"
      className={clsx(css.filterButton, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <FilterIcon />
    </button>
  );
};

export default FilterButton;

