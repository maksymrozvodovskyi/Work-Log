import React from "react";

interface ArrowIconProps {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
}

const ArrowIcon = ({ className, style, fill }: ArrowIconProps) => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {fill ? (
      <path d="M1 1L6 6L11 1" fill={fill} />
    ) : (
      <path
        d="M1 1L6 6L11 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

export default ArrowIcon;
