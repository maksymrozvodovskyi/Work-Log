type StatusFilterCircleIconPropsType = {
  className?: string;
  stroke?: string;
};

const StatusFilterCircleIcon = ({
  className,
  stroke = "#F5F6FA",
}: StatusFilterCircleIconPropsType) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5Z"
      stroke={stroke}
      strokeWidth={1}
    />
  </svg>
);

export default StatusFilterCircleIcon;
