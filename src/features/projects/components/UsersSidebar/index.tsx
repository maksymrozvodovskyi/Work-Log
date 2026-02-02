import { useMemo } from "react";
import { useTimelineContext } from "@/features/projects/context/useTimelineContext";
import css from "@/features/projects/index.module.css";
import SearchInput from "@/components/SearchInput";
import Loader from "@/components/Loader";
import { getRoleLabel } from "@/utils/userTransformers";

type UsersState = {
  userSearch: string;
  isLoadingUsers: boolean;
};

type UsersActions = {
  onSearchChange: (value: string) => void;
};

type UsersSidebarProps = {
  state: UsersState;
  actions: UsersActions;
};

export const UsersSidebar = ({
  state,
  actions,
}: UsersSidebarProps) => {
  const { users, isLoadingUsers } = useTimelineContext();
  const { userSearch } = state;
  const { onSearchChange } = actions;
  
  const usersListContent = useMemo(() => {
    if (isLoadingUsers && users.length === 0) {
      return { type: 'loading' as const };
    }

    if (users.length === 0) {
      return { type: 'empty' as const };
    }

    return {
      type: 'users' as const,
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        roleLabel: getRoleLabel(user.role),
      })),
    };
  }, [users, isLoadingUsers]);

  return (
    <aside className={css.usersSidebar}>
      <div className={css.usersSearchWrapper}>
        <SearchInput
          value={userSearch}
          onChange={onSearchChange}
          placeholder="Search by name, skills etc."
          ariaLabel="Search users"
          disabled={isLoadingUsers}
        />
      </div>
      <div className={css.usersList}>
        {usersListContent.type === 'loading' ? (
          <div className={css.usersLoading}>
            <Loader size="medium" />
          </div>
        ) : usersListContent.type === 'empty' ? (
          <div className={css.usersEmpty}>No users found</div>
        ) : (
          usersListContent.users.map((user) => (
            <div key={user.id} className={css.userItem}>
              <span className={css.userName}>
                {user.name}
                {user.roleLabel && `, ${user.roleLabel}`}
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

