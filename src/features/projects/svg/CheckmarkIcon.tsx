interface CheckmarkIconProps {
  className?: string;
  fill?: string;
}

const CheckmarkIcon = ({ className, fill = "#F5F6FA" }: CheckmarkIconProps) => (
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
      d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM8.49625 3.5C8.31811 3.5068 8.14888 3.58927 8.02692 3.72808L7.30158 4.53982L5.33159 6.79111L4.30685 5.89036C4.11628 5.72273 3.8541 5.67882 3.62355 5.77786C3.39905 5.8743 3.24215 6.08996 3.20728 6.34164C3.17278 6.59073 3.26225 6.84253 3.44599 7.00416L4.95922 8.33527C5.23264 8.57566 5.63331 8.5499 5.87773 8.27794L6.82177 7.21568L8.30072 5.51758L8.83312 4.91856C8.88981 4.85557 8.94654 4.79281 9.00418 4.72929C9.19566 4.52605 9.25298 4.21442 9.14827 3.94495C9.05409 3.70259 8.84419 3.5346 8.60161 3.50475L8.49625 3.5Z"
      fill={fill}
    />
  </svg>
);

export default CheckmarkIcon;
