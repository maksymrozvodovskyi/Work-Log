import React from "react";

type SquaresIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
};

const SquaresIcon = ({ className, style, fill = "#AEB8C2" }: SquaresIconPropsType) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.5 2H5.5C5.77614 2 6 2.22386 6 2.5V5.5C6 5.77614 5.77614 6 5.5 6H2.5C2.22386 6 2 5.77614 2 5.5V2.5C2 2.22386 2.22386 2 2.5 2ZM5 5V3H3V5H5Z"
      fill={fill}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 2H11.5C11.7761 2 12 2.22386 12 2.5V5.5C12 5.77614 11.7761 6 11.5 6H8.5C8.22386 6 8 5.77614 8 5.5V2.5C8 2.22386 8.22386 2 8.5 2ZM11 5V3H9V5H11Z"
      fill={fill}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.5 8H5.5C5.77614 8 6 8.22386 6 8.5V11.5C6 11.7761 5.77614 12 5.5 12H2.5C2.22386 12 2 11.7761 2 11.5V8.5C2 8.22386 2.22386 8 2.5 8ZM5 11V9H3V11H5Z"
      fill={fill}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 8H11.5C11.7761 8 12 8.22386 12 8.5V11.5C12 11.7761 11.7761 12 11.5 12H8.5C8.22386 12 8 11.7761 8 11.5V8.5C8 8.22386 8.22386 8 8.5 8ZM11 11V9H9V11H11Z"
      fill={fill}
    />
  </svg>
);

export default SquaresIcon;

