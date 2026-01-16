import css from "./index.module.css";

interface AuthPageHeaderProps {
  title?: string;
  description?: string;
}

export default function AuthPageHeader({
  title,
  description,
}: AuthPageHeaderProps) {
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
