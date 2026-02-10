import { useCallback, Activity } from "react";
import BaseModal from "@/components/BaseModal";
import SearchInput from "@/components/SearchInput";
import ToggleSwitch from "@/components/ToggleSwitch";
import Loader from "@/components/Loader";
import BackArrowIcon from "@/components/svg/BackArrowIcon";
import useSelectModal from "../../hooks/useSelectModal";
import { useItemToggleHandler } from "../../utils/selectModal";
import type { SelectModalProps, SelectModalItem } from "../../types/selectModal";
import css from "./SelectModal.module.css";

const SelectModal = <T extends SelectModalItem>({
  isOpen,
  onClose,
  selectedId,
  onSelect,
  title,
  placeholder,
  searchAriaLabel,
  emptyMessage,
  errorMessage,
  useSearch,
}: SelectModalProps<T>) => {
  const { searchTerm, setSearchTerm } = useSelectModal();
  const { items, isLoading, isError, error } = useSearch({
    searchTerm,
    isEnabled: isOpen,
  });

  const handleItemToggle = useItemToggleHandler(items, onSelect, onClose);
  const handleClose = useCallback(() => onClose(), [onClose]);

  const headerContent = (
    <div className={css.header}>
      <h2 className={css.title}>{title}</h2>
      <button
        type="button"
        className={css.nextButton}
        onClick={handleClose}
        aria-label="Close modal"
      >
        <BackArrowIcon
          style={{
            transform: "scaleX(-1)",
            transformOrigin: "center",
          }}
        />
      </button>
    </div>
  );

  const renderItem = (item: T) => (
    <div key={item.id} className={css.item}>
      <div className={css.itemInfo}>
        <span className={css.itemName}>{item.name}</span>
        {item.email && <span className={css.itemEmail}>{item.email}</span>}
      </div>
      <ToggleSwitch
        checked={selectedId === item.id}
        onChange={(checked) => handleItemToggle(item.id, checked)}
        ariaLabel={`Select ${item.name}`}
      />
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      headerContent={headerContent}
      width="336px"
      showOverlay={false}
    >
      <div className={css.content}>
        <div className={css.searchSection}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={placeholder}
            ariaLabel={searchAriaLabel}
          />
        </div>

        <div className={css.itemsList}>
          <Activity mode={isLoading ? "visible" : "hidden"}>
            <div className={css.loader}>
              <Loader size="medium" inline />
            </div>
          </Activity>

          <Activity mode={isError ? "visible" : "hidden"}>
            <div className={css.noItems}>
              <p>{error instanceof Error ? error.message : errorMessage}</p>
            </div>
          </Activity>

          <Activity mode={!isLoading && !isError && items && items.length === 0 ? "visible" : "hidden"}>
            <div className={css.noItems}>
              <p>{emptyMessage}</p>
            </div>
          </Activity>

          <Activity mode={!isLoading && !isError && items && items.length > 0 ? "visible" : "hidden"}>
            {items.map(renderItem)}
          </Activity>
        </div>
      </div>
    </BaseModal>
  );
};

export default SelectModal;
