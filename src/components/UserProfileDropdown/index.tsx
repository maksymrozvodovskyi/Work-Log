import { useClickOutside } from "@/hooks/useClickOutside";
import css from "./UserProfileDropdown.module.css";

type UserProfileDropdownPropsType = {
  isOpen: boolean;
  onClose: () => void;
};

const UserProfileDropdown = ({
  isOpen,
  onClose,
}: UserProfileDropdownPropsType) => {
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    if (isOpen) {
      onClose();
    }
  }, isOpen);

  if (!isOpen) return null;

  const handleOptionClick = () => {
    onClose();
  };

  return (
    <div ref={dropdownRef} className={css.dropdown}>
      <button
        type="button"
        className={css.dropdownItem}
        onClick={handleOptionClick}
      >
        Edit profile
      </button>
      <button
        type="button"
        className={css.dropdownItem}
        onClick={handleOptionClick}
      >
        Allow to edit all workloads
      </button>
      <button
        type="button"
        className={css.dropdownItem}
        onClick={handleOptionClick}
      >
        Export CV
      </button>
      <button
        type="button"
        className={css.dropdownItem}
        onClick={handleOptionClick}
      >
        Log out
      </button>
    </div>
  );
};

export default UserProfileDropdown;

