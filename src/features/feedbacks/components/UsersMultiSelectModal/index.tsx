import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import BaseModal from "@/components/BaseModal";
import BackArrowIcon from "@/components/svg/BackArrowIcon";
import Loader from "@/components/Loader";
import { useUserSearch } from "@/hooks/useUserSearch";
import SearchSection from "./components/SearchSection";
import SelectionCounter from "./components/SelectionCounter";
import UsersList from "./components/UsersList";
import SaveButton from "./components/SaveButton";
import css from "./components/UsersMultiSelectModal.module.css";

type UsersMultiSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedUserIds: string[];
  onSave: (users: { id: string; name: string }[]) => void;
  excludeUserId?: string;
};

type FormDataType = {
  searchTerm: string;
};

const UsersMultiSelectModal = ({
  isOpen,
  onClose,
  selectedUserIds,
  onSave,
  excludeUserId,
}: UsersMultiSelectModalProps) => {
  const { control, setValue, reset, clearErrors } = useForm<FormDataType>({
    defaultValues: {
      searchTerm: "",
    },
  });

  const searchTerm = useWatch({ control, name: "searchTerm" });
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedUserIds);

  const {
    items: users,
    total: totalUsers,
    isLoading,
    isError,
    error,
  } = useUserSearch({
    searchTerm,
    isEnabled: isOpen,
    excludeUserId,
  });

  const selectedCount = selectedIds.length;
  const allFilteredSelected =
    users.length > 0 && users.every((user) => selectedIds.includes(user.id));

  const handleToggleUser = (userId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(userId) ? prev : [...prev, userId];
      } else {
        return prev.filter((id) => id !== userId);
      }
    });
  };

  const handleToggleAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((user) => user.id));
    }
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        searchTerm: "",
      });
      clearErrors("root");
    }
  }, [isOpen, reset, clearErrors]);

  const handleSave = () => {
    const selectedUsersList = users
      .filter((u) => selectedIds.includes(u.id))
      .map((u) => ({ id: u.id, name: u.name }));

    onSave(selectedUsersList);

    onClose();
  };

  const handleClose = () => {
    reset({
      searchTerm: "",
    });
    setSelectedIds([]);
    clearErrors("root");
    onClose();
  };

  const headerContent = (
    <div className={css.header}>
      <h2 className={css.title}>Add receivers</h2>
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      headerContent={headerContent}
      width="336px"
    >
      <>
        <div className={css.content}>
          <SearchSection
            searchTerm={searchTerm}
            onSearchChange={(value) => setValue("searchTerm", value)}
          />

          <SelectionCounter selected={selectedCount} total={totalUsers} />

          <div className={css.usersList}>
            {isError && (
              <div className={css.emptyState}>
                <div className={css.emptyStateBox}>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load users"}
                </div>
              </div>
            )}

            {!isLoading && !isError && users.length === 0 && (
              <div className={css.emptyState}>
                <div className={css.emptyStateBox}>No users found</div>
              </div>
            )}

            {!isLoading && !isError && users.length > 0 && (
              <UsersList
                users={users}
                selectedIds={selectedIds}
                allFilteredSelected={allFilteredSelected}
                onToggleUser={handleToggleUser}
                onToggleAll={handleToggleAll}
              />
            )}
          </div>

          <SaveButton onSave={handleSave} disabled={selectedCount === 0} />
        </div>
        {isLoading && (
          <div className={css.loadingOverlay} aria-busy aria-live="polite">
            <Loader size="medium" inline />
          </div>
        )}
      </>
    </BaseModal>
  );
};

export default UsersMultiSelectModal;
