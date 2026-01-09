interface ArrowDownIconProps {
  className?: string;
  stroke?: string;
  strokeWidth?: string;
}

const ArrowDownIcon = ({
  className,
  stroke = "currentColor",
  strokeWidth = "1.5",
}: ArrowDownIconProps) => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M1 1L6 6L11 1" stroke={stroke} strokeWidth={strokeWidth} />
  </svg>
);

export default ArrowDownIcon;
