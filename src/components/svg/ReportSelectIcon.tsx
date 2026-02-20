type ReportSelectIconPropsType = {
  selected?: boolean;
  className?: string;
};

const ReportSelectIcon = ({
  selected = false,
  className,
}: ReportSelectIconPropsType) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    {selected ? (
      <circle cx="9" cy="9" r="8" fill="#4252ea" stroke="#5258f0" strokeWidth="1" />
    ) : (
      <circle
        cx="9"
        cy="9"
        r="7.5"
        fill="transparent"
        stroke="#8b97a3"
        strokeWidth="1.5"
      />
    )}
  </svg>
);

export default ReportSelectIcon;
