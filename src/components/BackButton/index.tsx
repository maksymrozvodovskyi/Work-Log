import { useNavigate } from "react-router-dom";
import css from "./BackButton.module.css";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={css.backButton}
      onClick={() => navigate(-1)}
      aria-label="Go back"
    >
      <svg
        width="7"
        height="12"
        viewBox="0 0 7 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.75432 0.225549C6.60538 0.081141 6.40326 0 6.19251 0C5.98175 0 5.77964 0.081141 5.63069 0.225549L0.232895 5.44925C0.0837837 5.59349 0 5.78923 0 5.99334C0 6.19745 0.0837837 6.39319 0.232895 6.53744L5.63069 11.7611C5.82962 11.9636 6.12627 12.0455 6.40555 11.9753C6.68482 11.905 6.90277 11.6936 6.97482 11.423C7.04688 11.1524 6.9617 10.8652 6.75234 10.6729L1.91636 5.99334L6.75234 1.31374C6.90171 1.16975 6.98585 0.974153 6.98623 0.770043C6.9866 0.565932 6.90317 0.370051 6.75432 0.225549Z"
          fill="#F5F6FA"
        />
      </svg>
    </button>
  );
};

export default BackButton;




