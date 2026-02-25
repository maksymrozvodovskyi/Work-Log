import React from "react";

type TableSortArrowDownIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
};

const TableSortArrowDownIcon = ({
  className,
  style,
  fill = "#494C55",
}: TableSortArrowDownIconPropsType) => (
  <svg
    width="4"
    height="3"
    viewBox="0 0 4 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0L2 3L4 0H0Z"
      fill={fill}
    />
  </svg>
);

export default TableSortArrowDownIcon;
