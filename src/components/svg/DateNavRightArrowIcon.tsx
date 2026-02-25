import React from "react";

type DateNavRightArrowIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  stroke?: string;
};

const DateNavRightArrowIcon = ({
  className,
  style,
  stroke = "#AEB8C2",
}: DateNavRightArrowIconPropsType) => (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M0.75 8.75L4.75 4.75L0.75 0.75"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default DateNavRightArrowIcon;
