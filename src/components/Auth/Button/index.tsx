import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import css from "./Button.module.css";

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonPropsType) {
  return (
    <button
      className={clsx(
        variant === "primary" && css.primaryButton,
        variant === "secondary" && css.secondaryButton,
        className
      )}
      {...props}
    />
  );
}
