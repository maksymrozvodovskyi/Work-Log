import clsx from "clsx";
import ArrowIcon from "@/features/projects/svg/ArrowIcon";
import css from "./SortArrows.module.css";

interface SortArrowsProps {
  field: string;
  currentSortField: string;
  sortDirection: "asc" | "desc" | null;
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
      <ArrowIcon
        className={clsx(css.headerArrow, isAscActive && css.active)}
        fill={isAscActive ? activeColor : inactiveColor}
        style={{
          width: "4px",
          height: "3px",
          transform: "rotate(180deg)",
          transformOrigin: "center",
        }}
      />
      <ArrowIcon
        className={clsx(css.headerArrow, isDescActive && css.active)}
        fill={isDescActive ? activeColor : inactiveColor}
        style={{
          width: "4px",
          height: "3px",
        }}
      />
    </div>
  );
}

export default SortArrows;
