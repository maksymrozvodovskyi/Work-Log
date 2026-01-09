interface PlusIconProps {
  className?: string;
  stroke?: string;
  strokeWidth?: string;
}

const PlusIcon = ({
  className,
  stroke = "white",
  strokeWidth = "1.5",
}: PlusIconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 1V11M1 6H11"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export default PlusIcon;
