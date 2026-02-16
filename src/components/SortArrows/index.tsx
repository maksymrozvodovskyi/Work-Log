import clsx from "clsx";
import ArrowIcon from "@/components/svg/ArrowIcon";
import SortArrowActiveIcon from "@/components/svg/SortArrowActiveIcon";
import css from "./SortArrows.module.css";

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
      {isAscActive ? (
        <SortArrowActiveIcon
          className={clsx(css.headerArrow, css.active)}
          style={{
            transform: "rotate(180deg)",
            transformOrigin: "center",
          }}
        />
      ) : (
        <ArrowIcon
          className={css.headerArrow}
          fill={INACTIVE_COLOR}
          style={{
            width: "4px",
            height: "3px",
            transform: "rotate(180deg)",
            transformOrigin: "center",
          }}
        />
      )}
      {isDescActive ? (
        <SortArrowActiveIcon className={clsx(css.headerArrow, css.active)} />
      ) : (
        <ArrowIcon
          className={css.headerArrow}
          fill={INACTIVE_COLOR}
          style={{
            width: "4px",
            height: "3px",
          }}
        />
      )}
    </div>
  );
}

export default SortArrows;
