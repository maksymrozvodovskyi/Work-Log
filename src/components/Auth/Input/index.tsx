import { useState, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import EyeIcon from "../EyeIcon";
import css from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  error,
  className,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={css.inputWrapper}>
      <input
        type={inputType}
        className={clsx(
          css.input,
          error && css.inputError,
          isPassword && css.inputWithToggle,
          className
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={css.passwordToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <EyeIcon isOpen={showPassword} />
        </button>
      )}
    </div>
  );
}
