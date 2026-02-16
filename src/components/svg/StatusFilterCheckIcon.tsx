type StatusFilterCheckIconPropsType = {
  className?: string;
  fill?: string;
};

const StatusFilterCheckIcon = ({
  className,
  fill = "#F5F6FA",
}: StatusFilterCheckIconPropsType) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM8.49625 3.5L8.60161 3.50475C8.84419 3.5346 9.05409 3.70259 9.14827 3.94495C9.25298 4.21442 9.19566 4.52605 9.00418 4.72929C8.77362 4.98336 8.55761 5.2254 8.30072 5.51758L6.82177 7.21568L5.87773 8.27794C5.63331 8.5499 5.23264 8.57566 4.95922 8.33527L3.44599 7.00416C3.26225 6.84253 3.17278 6.59073 3.20728 6.34164C3.24215 6.08996 3.39905 5.8743 3.62355 5.77786C3.8541 5.67882 4.11628 5.72273 4.30685 5.89036L5.33159 6.79111L7.30158 4.53982L8.02692 3.72808C8.14888 3.58927 8.31811 3.5068 8.49625 3.5Z"
      fill={fill}
    />
  </svg>
);

export default StatusFilterCheckIcon;
