import css from "./index.module.css";

type AuthPageHeaderPropsType = {
  title?: string;
  description?: string;
};

export default function AuthPageHeader({
  title,
  description,
}: AuthPageHeaderPropsType) {
  if (!title && !description) {
    return null;
  }

  return (
    <div className={css.textContent}>
      {title && <h1 className={css.title}>{title}</h1>}
      {description && <p className={css.description}>{description}</p>}
    </div>
  );
}
