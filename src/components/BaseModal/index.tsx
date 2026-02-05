import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useKeyboard } from "@/hooks/useKeyboard";
import css from "./BaseModal.module.css";

type BaseModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerContent?: ReactNode;
  width?: string;
  usePortal?: boolean;
  showOverlay?: boolean;
  children: ReactNode;
};

const BaseModal = ({
  isOpen,
  onClose,
  title,
  headerContent,
  width = "400px",
  usePortal = true,
  showOverlay = true,
  children,
}: BaseModalPropsType) => {
  useKeyboard(isOpen, onClose);

  useEffect(() => {
    if (isOpen && usePortal) {
      document.body.style.overflow = 'hidden';
    } else if (usePortal) {
      document.body.style.overflow = 'unset';
    }

    return () => {
      if (usePortal) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, usePortal]);

  if (!isOpen) return null;

  const zIndex = usePortal ? 1500 : 1000;

  const modalContent = (
    <>
      {showOverlay && (
        <div
          className={css.overlay}
          onClick={onClose}
          style={{ zIndex: zIndex - 1 }}
        />
      )}
      <div
        className={css.modal}
        style={{ width, zIndex }}
      >
        {headerContent || (
          <div className={css.header}>
            {title && <h2 className={css.title}>{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </>
  );

  if (usePortal) {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default BaseModal;

