import React from "react";

type ArrowIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
};

const ArrowIcon = ({ className, style, fill }: ArrowIconPropsType) => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M0.599609 0.600098L3.59961 3.6001L6.59961 0.600098"
      stroke={fill || "#AEB8C2"}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export default ArrowIcon;
