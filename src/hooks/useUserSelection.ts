import type { UseFormSetValue } from "react-hook-form";

type FormDataType = {
  searchTerm: string;
  selectedUsers: Record<string, boolean>;
};

type UserSelectionItemType = {
  id: string;
  name: string;
};

type UseUserSelectionPropsType = {
  users: UserSelectionItemType[];
  selectedUsers: Record<string, boolean>;
  setValue: UseFormSetValue<FormDataType>;
};

function createInitialSelectedUsers(ids: string[]): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const id of ids) {
    result[id] = true;
  }
  return result;
}

export const useUserSelection = ({
  users,
  selectedUsers,
  setValue,
}: UseUserSelectionPropsType) => {
  const selectedIds = Object.keys(selectedUsers).filter(
    (id) => selectedUsers[id] === true,
  );
  const selectedCount = selectedIds.length;

  let allFilteredSelected = false;
  if (users && users.length > 0) {
    allFilteredSelected = users.every(
      (user) => selectedUsers[user.id] === true,
    );
  }

  const handleToggleUser = (userId: string, checked: boolean) => {
    setValue(`selectedUsers.${userId}`, checked, { shouldDirty: true });
  };

  const handleToggleAll = () => {
    const selectAll = !allFilteredSelected;
    const usersList = users ?? [];
    for (const user of usersList) {
      setValue(`selectedUsers.${user.id}`, selectAll, { shouldDirty: true });
    }
  };

  return {
    selectedIds,
    selectedCount,
    allFilteredSelected,
    handleToggleUser,
    handleToggleAll,
    createInitialSelectedUsers,
  };
};
