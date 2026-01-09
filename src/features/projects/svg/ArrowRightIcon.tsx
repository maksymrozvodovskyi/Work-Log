interface ArrowRightIconProps {
  className?: string;
  fill?: string;
}

const ArrowRightIcon = ({
  className,
  fill = "#F5F6FA",
}: ArrowRightIconProps) => (
  <svg
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0.245678 0.225549C0.394623 0.081141 0.596736 0 0.807493 0C1.01825 0 1.22036 0.081141 1.36931 0.225549L6.76711 5.44925C6.91622 5.59349 7 5.78923 7 5.99334C7 6.19745 6.91622 6.39319 6.76711 6.53744L1.36931 11.7611C1.17038 11.9636 0.873728 12.0455 0.594452 11.9753C0.315176 11.905 0.0972313 11.6936 0.0251775 11.423C-0.0468763 11.1524 0.0383015 10.8652 0.247663 10.6729L5.08364 5.99334L0.247663 1.31374C0.0982884 1.16975 0.0141475 0.974153 0.0137751 0.770043C0.0134027 0.565932 0.0968295 0.370051 0.245678 0.225549Z"
      fill={fill}
    />
  </svg>
);

export default ArrowRightIcon;
