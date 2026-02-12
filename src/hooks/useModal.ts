import { useEffect } from "react";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useClickOutside } from "@/hooks/useClickOutside";

type UseModalOptions = {
  isClickOutsideEnabled?: boolean;
};

export const useModal = <T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  options?: UseModalOptions,
) => {
  const isClickOutsideEnabled = options?.isClickOutsideEnabled ?? isOpen;

  useKeyboard(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalRef = useClickOutside<T>(onClose, isClickOutsideEnabled);

  return { modalRef };
};
