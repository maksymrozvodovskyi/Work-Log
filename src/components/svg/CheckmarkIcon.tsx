type CheckmarkIconPropsType = {
  className?: string;
  fill?: string;
};

const CheckmarkIcon = ({
  className,
  fill = "#F5F6FA",
}: CheckmarkIconPropsType) => (
  <svg
    width="9"
    height="7"
    viewBox="0 0 9 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.30766 0.000553702C8.13449 0.00632656 7.97028 0.0827103 7.8499 0.213488C6.20444 1.94424 4.70553 3.65172 3.10583 5.35647L1.08232 3.65852C0.896475 3.50247 0.645432 3.46234 0.423754 3.55324C0.202076 3.64414 0.0434419 3.85226 0.00760748 4.09921C-0.0282269 4.34615 0.0641825 4.5944 0.250026 4.75044L2.7469 6.84694C3.01304 7.0703 3.3969 7.04674 3.63642 6.79235C5.42567 4.91039 7.03477 3.05488 8.79663 1.20167C8.99538 1.00025 9.05498 0.690949 8.94642 0.424301C8.83787 0.157653 8.58372 -0.0109492 8.30766 0.000553702Z"
      fill={fill}
    />
  </svg>
);

export default CheckmarkIcon;
