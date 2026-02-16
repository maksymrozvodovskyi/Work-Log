import React from "react";

type ResultsDownloadIconPropsType = {
  className?: string;
  style?: React.CSSProperties;
};

const ResultsDownloadIcon = ({
  className,
  style,
}: ResultsDownloadIconPropsType) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle cx="16" cy="16" r="16" fill="#4252EA" />
    <path
      d="M18.5662 14.5781L15.9882 17.0001L13.4102 14.5781"
      stroke="white"
      strokeWidth="1.2"
    />
    <path
      d="M22.0323 16.0205V19.2573C21.8604 20.3745 20.8865 21.1765 19.7694 21.1765H12.2073C11.0901 21.1765 10.1448 20.3745 9.94434 19.2573V16.0205"
      stroke="white"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M15.9879 16.3018V10"
      stroke="white"
      strokeWidth="1.2"
    />
  </svg>
);

export default ResultsDownloadIcon;
