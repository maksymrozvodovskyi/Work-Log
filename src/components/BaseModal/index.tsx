import type { ReactNode } from "react";
import { useKeyboard } from "@/hooks/useKeyboard";
import css from "./BaseModal.module.css";

type BaseModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerContent?: ReactNode;
  width?: string;
  children: ReactNode;
};

const BaseModal = ({
  isOpen,
  onClose,
  title,
  headerContent,
  width = "400px",
  children,
}: BaseModalPropsType) => {
  useKeyboard(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <>
      <div className={css.overlay} onClick={onClose} />
      <div className={css.modal} style={{ width }}>
        {headerContent || (
          <div className={css.header}>
            {title && <h2 className={css.title}>{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default BaseModal;

