import React from "react";

type DateNavLeftArrowIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  stroke?: string;
};

const DateNavLeftArrowIcon = ({
  className,
  style,
  stroke = "#AEB8C2",
}: DateNavLeftArrowIconPropsType) => (
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
      d="M5.06055 8.75L1.06055 4.75L5.06055 0.75"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default DateNavLeftArrowIcon;
