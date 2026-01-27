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
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: "scaleX(-1)",
                transformOrigin: "center",
              }}
            >
              <path
                d="M6.75432 0.225549C6.60538 0.081141 6.40326 0 6.19251 0C5.98175 0 5.77964 0.081141 5.63069 0.225549L0.232895 5.44925C0.0837837 5.59349 0 5.78923 0 5.99334C0 6.19745 0.0837837 6.39319 0.232895 6.53744L5.63069 11.7611C5.82962 11.9636 6.12627 12.0455 6.40555 11.9753C6.68482 11.905 6.90277 11.6936 6.97482 11.423C7.04688 11.1524 6.9617 10.8652 6.75234 10.6729L1.91636 5.99334L6.75234 1.31374C6.90171 1.16975 6.98585 0.974153 6.98623 0.770043C6.9866 0.565932 6.90317 0.370051 6.75432 0.225549Z"
                fill="#F5F6FA"
              />
            </svg>
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
