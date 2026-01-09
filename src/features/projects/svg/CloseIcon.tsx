interface CloseIconProps {
  className?: string;
  fill?: string;
  stroke?: string;
}

const CloseIcon = ({
  className,
  fill = "#AEB8C2",
  stroke = "#AEB8C2",
}: CloseIconProps) => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.94163 7.17763C8.15292 7.38791 8.15292 7.73199 7.94163 7.94227C7.73035 8.15254 7.38461 8.15254 7.17333 7.94227L4.1001 4.88373L1.02687 7.94227C0.815584 8.15254 0.469846 8.15254 0.258561 7.94227C0.0472765 7.73199 0.0472765 7.38791 0.258561 7.17763L3.351 4.09998L0.258561 1.02232C0.0472765 0.812042 0.0472765 0.467956 0.258561 0.257682C0.469846 0.0474069 0.815584 0.0474069 1.02687 0.257682L4.1001 3.31622L7.17333 0.257682C7.38461 0.0474069 7.73035 0.0474069 7.94163 0.257682C8.15292 0.467956 8.15292 0.812042 7.94163 1.02232L4.8492 4.09998L7.94163 7.17763Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="0.2"
    />
  </svg>
);

export default CloseIcon;
