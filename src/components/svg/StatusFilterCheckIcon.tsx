type StatusFilterCheckIconPropsType = {
  className?: string;
  fill?: string;
};

const StatusFilterCheckIcon = ({
  className,
  fill = "#F5F6FA",
}: StatusFilterCheckIconPropsType) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM10.4963 5.5C10.3181 5.5068 10.1489 5.58927 10.0269 5.72808L9.30158 6.53982L7.33159 8.79111L6.30685 7.89036C6.11628 7.72273 5.8541 7.67882 5.62355 7.77786C5.39905 7.8743 5.24215 8.08996 5.20728 8.34164C5.17278 8.59073 5.26225 8.84253 5.44599 9.00416L6.95922 10.3353C7.23264 10.5757 7.63331 10.5499 7.87773 10.2779L8.82177 9.21568L10.3007 7.51758L10.8331 6.91856C10.8898 6.85557 10.9465 6.79281 11.0042 6.72929C11.1957 6.52605 11.253 6.21442 11.1483 5.94495C11.0541 5.70259 10.8442 5.5346 10.6016 5.50475L10.4963 5.5Z"
      fill={fill}
    />
  </svg>
);

export default StatusFilterCheckIcon;
