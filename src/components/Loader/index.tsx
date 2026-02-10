import React from "react";
import clsx from "clsx";
import css from "./Loader.module.css";

type LoaderPropsType = {
  size?: "small" | "medium" | "large";
  className?: string;
  inline?: boolean;
};

const Loader: React.FC<LoaderPropsType> = ({ size = "medium", className = "", inline = false }) => {
  const sizeClasses = {
    small: css.loaderSmall,
    medium: css.loaderMedium,
    large: css.loaderLarge,
  };

  const containerClass = inline ? css.loaderContainerInline : css.loaderContainer;

  return (
    <div className={clsx(containerClass, className)}>
      <div className={clsx(css.loader, sizeClasses[size])}>
        <div className={css.loaderSpinner}>
          <div className={css.loaderDot}></div>
          <div className={css.loaderDot}></div>
          <div className={css.loaderDot}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

