import ToggleSwitch from "@/components/ToggleSwitch";
import css from "./UsersMultiSelectModal.module.css";

type User = {
  id: string;
  name: string;
};

type UserListItemProps = {
  user: User;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
};

export default function UserListItem({ user, isSelected, onToggle }: UserListItemProps) {
  return (
    <div className={css.userItem}>
      <span className={css.userName}>{user.name}</span>
      <ToggleSwitch
        checked={isSelected}
        onChange={onToggle}
        ariaLabel={`Toggle ${user.name}`}
      />
    </div>
  );
}