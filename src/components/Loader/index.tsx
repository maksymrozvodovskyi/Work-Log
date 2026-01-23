import React from "react";
import clsx from "clsx";
import css from "./Loader.module.css";

type LoaderPropsType = {
  size?: "small" | "medium" | "large";
  className?: string;
};

const Loader: React.FC<LoaderPropsType> = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: css.loaderSmall,
    medium: css.loaderMedium,
    large: css.loaderLarge,
  };

  return (
    <div className={clsx(css.loaderContainer, className)}>
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

