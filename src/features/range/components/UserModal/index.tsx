import { useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { createUser, updateUser } from "@/api/users";
import type { UserRangeType, UserStatusType } from "@/types/User";
import type { UserRoleType } from "@/types/Project";
import { userStatusMap } from "@/types/UserStatusMap";
import { USER_STATUS_ORDER } from "@/types/UserStatusOrder";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import { useKeyboard } from "@/hooks/useKeyboard";
import { getButtonText } from "@/utils/modal";
import { handleAxiosError } from "@/utils/axiosError";
import css from "./UserModal.module.css";
import BackArrowIcon from "@/components/svg/BackArrowIcon";

type UserModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  user?: UserRangeType | null;
};

type UserModalFormDataType = {
  name: string;
  email: string;
  password: string;
  status: UserStatusType;
  userType: UserRoleType;
};

const UserModal = ({ isOpen, onClose, user = null }: UserModalPropsType) => {
  const isEditing = !!user;
  const idPrefix = isEditing ? "edit-" : "";

  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<UserModalFormDataType>({
    mode: "onChange",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      status: user?.status || "GREEN",
      userType: user?.userType || "EMPLOYEE",
    });
  }, [user, reset]);

  const handleClose = useCallback(() => {
    reset({
      name: "",
      email: "",
      password: "",
      status: "GREEN",
      userType: "EMPLOYEE",
    });
    clearErrors("root");
    onClose();
  }, [onClose, reset, clearErrors]);

  const onSubmit = async (data: UserModalFormDataType) => {
    clearErrors("root");

    try {
      if (isEditing) {
        await updateUser(user!.id, {
          name: data.name.trim(),
          email: data.email.trim(),
          status: data.status,
          userType: data.userType,
        });
      } else {
        await createUser({
          name: data.name.trim(),
          email: data.email.trim(),
          password: data.password,
          role: data.userType,
          status: data.status,
        });
      }

      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEYS.users],
      });
      handleClose();
    } catch (err) {
      const errorMessage = handleAxiosError(
        err,
        isEditing ? "Failed to update user" : "Failed to create user"
      );
      setError("root", {
        message: errorMessage,
      });
    }
  };

  useKeyboard(isOpen, handleClose);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={css.overlay} 
        onClick={isSubmitting ? undefined : handleClose} 
      />
      <div className={css.modal}>
        <div className={css.header}>
          <h2 className={css.title}>
            {isEditing ? "Edit user" : "Create user"}
          </h2>
          <button
            type="button"
            className={css.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <BackArrowIcon
              style={{
                transform: "scaleX(-1)",
                transformOrigin: "center",
              }}
            />
          </button>
        </div>

        <form onSubmit={handleFormSubmit(onSubmit)} className={css.form}>
          <div className={clsx(css.field, css.nameField)}>
            <label htmlFor={`${idPrefix}name`} className={css.label}>
              Name
            </label>
            <input
              id={`${idPrefix}name`}
              type="text"
              className={css.input}
              {...register("name", {
                required: "Name is required",
                validate: (value: string) =>
                  value.trim().length > 0 || "Name cannot be empty",
              })}
              placeholder="User name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <div className={css.error}>{errors.name.message}</div>
            )}
          </div>

          <div className={clsx(css.field, css.emailField)}>
            <label htmlFor={`${idPrefix}email`} className={css.label}>
              Email
            </label>
            <input
              id={`${idPrefix}email`}
              type="email"
              className={css.input}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="user@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className={css.error}>{errors.email.message}</div>
            )}
          </div>

          {!isEditing && (
            <div className={clsx(css.field, css.emailField)}>
              <label htmlFor={`${idPrefix}password`} className={css.label}>
                Password
              </label>
              <input
                id={`${idPrefix}password`}
                type="password"
                className={css.input}
                {...register("password", {
                  required: !isEditing ? "Password is required" : false,
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <div className={css.error}>{errors.password.message}</div>
              )}
            </div>
          )}

          <div className={clsx(css.field, css.statusField)}>
            <label className={css.label}>Status</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({
                field,
              }: {
                field: {
                  value: UserStatusType;
                  onChange: (value: UserStatusType) => void;
                };
              }) => (
                <div className={css.statusGrid}>
                  {USER_STATUS_ORDER.map((statusOption) => {
                    const statusInfo = userStatusMap[statusOption];

                    if (!statusInfo) return null;

                    return (
                      <button
                        key={statusOption}
                        type="button"
                        className={clsx(
                          css.statusButton,
                          field.value === statusOption && css.statusButtonActive
                        )}
                        onClick={() => field.onChange(statusOption)}
                        disabled={isSubmitting}
                      >
                        {statusInfo.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.status && (
              <div className={css.error}>{errors.status.message}</div>
            )}
          </div>

          <div className={clsx(css.field, css.statusField)}>
            <label className={css.label}>User type</label>
            <Controller
              name="userType"
              control={control}
              rules={{ required: "User type is required" }}
              render={({
                field,
              }: {
                field: {
                  value: UserRoleType;
                  onChange: (value: UserRoleType) => void;
                };
              }) => (
                <div className={css.statusGrid}>
                  <button
                    type="button"
                    className={clsx(
                      css.statusButton,
                      field.value === "EMPLOYEE" && css.statusButtonActive
                    )}
                    onClick={() => field.onChange("EMPLOYEE")}
                    disabled={isSubmitting}
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      css.statusButton,
                      field.value === "ADMIN" && css.statusButtonActive
                    )}
                    onClick={() => field.onChange("ADMIN")}
                    disabled={isSubmitting}
                  >
                    Admin
                  </button>
                </div>
              )}
            />
            {errors.userType && (
              <div className={css.error}>{errors.userType.message}</div>
            )}
          </div>

          {errors.root?.message && (
            <div className={css.errorGeneral}>{errors.root.message}</div>
          )}

          <button
            type="submit"
            className={css.createButton}
            disabled={isSubmitting}
          >
            {getButtonText(isSubmitting, isEditing)}
          </button>
        </form>
      </div>
    </>
  );
};

export default UserModal;
