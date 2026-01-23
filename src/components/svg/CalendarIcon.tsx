import React from "react";

type CalendarIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  stroke?: string;
  strokeWidth?: number | string;
};

const CalendarIcon = ({
  className,
  style,
  stroke = "#AEB8C2",
  strokeWidth = "1.2",
}: CalendarIconPropsType) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect
      x="0.600098"
      y="1.36157"
      width="9.9"
      height="9.9"
      rx="1.98"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M0.605957 4.34879H10.4701"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M3.00479 0.600098V2.18003"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M8.33585 0.600098V2.18003"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export default CalendarIcon;

