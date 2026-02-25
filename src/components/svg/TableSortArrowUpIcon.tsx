import React from "react";

type TableSortArrowUpIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
};

const TableSortArrowUpIcon = ({
  className,
  style,
  fill = "#494C55",
}: TableSortArrowUpIconPropsType) => (
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
      d="M0 3L2 0L4 3H0Z"
      fill={fill}
    />
  </svg>
);

export default TableSortArrowUpIcon;
