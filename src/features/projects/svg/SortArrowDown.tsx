interface SortArrowDownProps {
  className?: string;
  fill?: string;
}

const SortArrowDown = ({ className, fill = "#aeb8c2" }: SortArrowDownProps) => (
  <svg
    width="4"
    height="3"
    viewBox="0 0 4 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0L2 3L4 0H0Z"
      fill={fill}
    />
  </svg>
);

export default SortArrowDown;
