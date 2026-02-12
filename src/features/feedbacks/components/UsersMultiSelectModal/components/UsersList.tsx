import ToggleSwitch from "@/components/ToggleSwitch";
import UserListItem from "./UserListItem";
import css from "./UsersMultiSelectModal.module.css";

type User = {
  id: string;
  name: string;
};

type UsersListProps = {
  users: User[];
  selectedIds: string[];
  allFilteredSelected: boolean;
  onToggleUser: (userId: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
};

export default function UsersList({
  users,
  selectedIds,
  allFilteredSelected,
  onToggleUser,
  onToggleAll,
}: UsersListProps) {
  return (
    <>
      <div className={css.userItem}>
        <span className={css.userName}>Select all</span>
        <ToggleSwitch
          checked={allFilteredSelected}
          onChange={onToggleAll}
          ariaLabel="Select all users"
        />
      </div>
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          isSelected={selectedIds.includes(user.id)}
          onToggle={(checked) => onToggleUser(user.id, checked)}
        />
      ))}
    </>
  );
}
