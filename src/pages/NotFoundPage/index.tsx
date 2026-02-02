import { useNavigate } from "react-router-dom";
import css from "./index.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={css.container}>
      <div className={css.content}>
        <h1 className={css.title}>404</h1>
        <p className={css.message}>Page Not Found</p>
        <p className={css.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          type="button"
          className={css.button}
          onClick={handleGoHome}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

