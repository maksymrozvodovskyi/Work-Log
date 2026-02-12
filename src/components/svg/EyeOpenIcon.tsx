type EyeOpenIconPropsType = {
  className?: string;
};

const EyeOpenIcon = ({ className }: EyeOpenIconPropsType) => (
  <svg
    width="20"
    height="13"
    viewBox="0 0 20 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.75 6.15C18.75 6.15 16.05 11.55 9.75 11.55C3.45 11.55 0.75 6.15 0.75 6.15C0.75 6.15 3.45 0.75 9.75 0.75C16.05 0.75 18.75 6.15 18.75 6.15Z"
      stroke="#494C55"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="9.75005"
      cy="6.14995"
      r="2.7"
      stroke="#494C55"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EyeOpenIcon;