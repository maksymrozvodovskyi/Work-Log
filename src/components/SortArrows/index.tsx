import clsx from "clsx";
import ArrowIcon from "@/features/projects/svg/ArrowIcon";
import css from "./SortArrows.module.css";

const ACTIVE_COLOR = "#6b7682";
const INACTIVE_COLOR = "#aeb8c2";

type SortArrowsPropsType = {
  field: string;
  currentSortField: string;
  sortDirection: "asc" | "desc" | null;
  className?: string;
};

function SortArrows({
  field,
  currentSortField,
  sortDirection,
  className,
}: SortArrowsPropsType) {
  const isAscActive = field === currentSortField && sortDirection === "asc";
  const isDescActive = field === currentSortField && sortDirection === "desc";

  return (
    <div className={clsx(css.arrowsContainer, className)}>
      <ArrowIcon
        className={clsx(css.headerArrow, isAscActive && css.active)}
        fill={isAscActive ? ACTIVE_COLOR : INACTIVE_COLOR}
        style={{
          width: "4px",
          height: "3px",
          transform: "rotate(180deg)",
          transformOrigin: "center",
        }}
      />
      <ArrowIcon
        className={clsx(css.headerArrow, isDescActive && css.active)}
        fill={isDescActive ? ACTIVE_COLOR : INACTIVE_COLOR}
        style={{
          width: "4px",
          height: "3px",
        }}
      />
    </div>
  );
}

export default SortArrows;
