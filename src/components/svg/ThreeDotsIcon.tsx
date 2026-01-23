import React from "react";

type ThreeDotsIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
};

const ThreeDotsIcon = ({ className, style, fill = "#8B97A3" }: ThreeDotsIconPropsType) => (
  <svg
    width="18"
    height="4"
    viewBox="0 0 18 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle cx="2" cy="2" r="2" fill={fill} />
    <circle cx="9" cy="2" r="2" fill={fill} />
    <circle cx="16" cy="2" r="2" fill={fill} />
  </svg>
);

export default ThreeDotsIcon;

