import { useNavigate } from "react-router-dom";
import css from "./BackButton.module.css";
import BackArrowIcon from "@/components/svg/BackArrowIcon";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={css.backButton}
      onClick={() => navigate("/range")}
      aria-label="Go back"
    >
      <BackArrowIcon />
    </button>
  );
};

export default BackButton;




