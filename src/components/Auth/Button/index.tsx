import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import css from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary" ? css.primaryButton : css.secondaryButton;

  return <button className={clsx(variantClass, className)} {...props} />;
}
