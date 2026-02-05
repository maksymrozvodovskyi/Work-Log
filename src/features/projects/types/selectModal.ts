export interface SelectModalItem {
  id: string;
  name: string;
  email?: string; // опціонально для проектів
}

export interface SelectModalProps<T extends SelectModalItem> {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string | null;
  onSelect: (item: T | null) => void;
  title: string;
  placeholder: string;
  searchAriaLabel: string;
  emptyMessage: string;
  errorMessage: string;
  useSearch: (params: { searchTerm: string; isEnabled: boolean }) => {
    items: T[];
    isLoading: boolean;
    isError: boolean;
    error?: Error;
  };
}
