import type { CSSProperties } from "react";

type SortArrowActiveIconPropsType = {
  className?: string;
  style?: CSSProperties;
};

const SortArrowActiveIcon = ({ className, style }: SortArrowActiveIconPropsType) => (
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
      fill="#F5F6FA"
    />
  </svg>
);

export default SortArrowActiveIcon;
