import SelectModal from "../SelectModal";
import { useUserSearch } from "@/hooks/useUserSearch";
import type { ApiUserType } from "@/utils/userTransformers";

export type UserSelectModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  selectedUserId: string | null;
  onSelect: (user: ApiUserType | null) => void;
  excludeUserId?: string;
};

const UserSelectModal = (props: UserSelectModalPropsType) => {
  const useSearchWithExclude = (params: {
    searchTerm: string;
    isEnabled: boolean;
  }) =>
    useUserSearch({
      ...params,
      excludeUserId: props.excludeUserId,
    });

  return (
    <SelectModal
      {...props}
      selectedId={props.selectedUserId}
      title="Select employee"
      placeholder="Search by name"
      searchAriaLabel="Search users"
      emptyMessage="No users found"
      errorMessage="Error loading users. Please try again."
      useSearch={useSearchWithExclude}
    />
  );
};

export default UserSelectModal;
