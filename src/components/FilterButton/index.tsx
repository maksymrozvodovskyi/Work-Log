import { type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import css from "./FilterButton.module.css";
import FilterIcon from "@/components/svg/FilterIcon";

type FilterButtonPropsType = ComponentPropsWithoutRef<"button">;

const FilterButton = ({ className, ...props }: FilterButtonPropsType) => {
  return (
    <button
      type="button"
      className={clsx(css.filterButton, className)}
      {...props}
    >
      <FilterIcon />
    </button>
  );
};

export default FilterButton;

