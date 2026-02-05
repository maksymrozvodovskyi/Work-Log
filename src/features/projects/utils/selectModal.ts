import { useCallback } from "react";

export const useItemToggleHandler = <T extends { id: string }>(
  items: T[],
  onSelect: (item: T | null) => void,
  onClose: () => void
) => {
  return useCallback((itemId: T["id"], checked: boolean) => {
    if (checked) {
      const item = items.find((item) => item.id === itemId);
      if (item) {
        onSelect(item);
        onClose();
      }
    } else {
      onSelect(null);
    }
  }, [items, onSelect, onClose]);
};
