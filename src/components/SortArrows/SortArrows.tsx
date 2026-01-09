import clsx from "clsx";
import SortArrowUp from "../../features/projects/svg/SortArrowUp";
import SortArrowDown from "../../features/projects/svg/SortArrowDown";
import css from "./SortArrows.module.css";

interface SortArrowsProps {
  field: string;
  currentSortField: string;
  sortDirection: "asc" | "desc";
  className?: string;
}

function SortArrows({
  field,
  currentSortField,
  sortDirection,
  className,
}: SortArrowsProps) {
  const isAscActive = field === currentSortField && sortDirection === "asc";
  const isDescActive = field === currentSortField && sortDirection === "desc";

  const activeColor = "#6b7682";
  const inactiveColor = "#aeb8c2";

  return (
    <div className={clsx(css.arrowsContainer, className)}>
      <SortArrowUp
        className={clsx(css.headerArrow, isAscActive && css.active)}
        fill={isAscActive ? activeColor : inactiveColor}
      />
      <SortArrowDown
        className={clsx(css.headerArrow, isDescActive && css.active)}
        fill={isDescActive ? activeColor : inactiveColor}
      />
    </div>
  );
}

export default SortArrows;

