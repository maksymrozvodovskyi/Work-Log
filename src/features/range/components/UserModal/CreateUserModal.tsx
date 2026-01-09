import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { createUser } from "../../../../api/users";
import type { UserStatus } from "../../../../types/User";
import { userStatusMap } from "../../../../types/UserStatusMap";
import { USER_STATUS_ORDER } from "../../../../types/UserStatusOrder";
import {
  createUserSchema,
  type CreateUserFormData,
} from "../../validation/userSchema";
import ArrowRightIcon from "../../../projects/svg/ArrowRightIcon";
import css from "./UserModal.module.css";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "GREEN",
      mainProject: "",
    },
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleClose = useCallback(() => {
    reset();
    setError(null);
    onClose();
  }, [onClose, reset]);

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createUser({
        name: data.name.trim(),
        email: data.email.trim(),
        status: data.status,
        mainProject: data.mainProject.trim() || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={css.overlay} onClick={handleClose} />
      <div className={css.modal}>
        <div className={css.header}>
          <h2 className={css.title}>Add user</h2>
          <button
            type="button"
            className={css.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <ArrowRightIcon />
          </button>
        </div>

        <form onSubmit={handleFormSubmit(onSubmit)} className={css.form}>
          <div className={clsx(css.field, css.nameField)}>
            <label htmlFor="user-name" className={css.label}>
              Name
            </label>
            <input
              id="user-name"
              type="text"
              className={css.input}
              {...register("name")}
              placeholder="User name"
            />
            {errors.name && (
              <div className={css.error}>{errors.name.message}</div>
            )}
          </div>

          <div className={clsx(css.field, css.emailField)}>
            <label htmlFor="user-email" className={css.label}>
              Email
            </label>
            <input
              id="user-email"
              type="email"
              className={css.input}
              {...register("email")}
              placeholder="user@example.com"
            />
            {errors.email && (
              <div className={css.error}>{errors.email.message}</div>
            )}
          </div>

          <div className={clsx(css.field, css.statusField)}>
            <label className={css.label}>Status</label>
            <Controller
              name="status"
              control={control}
              render={({
                field,
              }: {
                field: {
                  value: UserStatus;
                  onChange: (value: UserStatus) => void;
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

          <div className={clsx(css.field, css.mainProjectField)}>
            <label htmlFor="main-project" className={css.label}>
              Main project
            </label>
            <input
              id="main-project"
              type="text"
              className={css.input}
              {...register("mainProject")}
              placeholder="Main project name"
            />
          </div>

          {error && <div className={css.generalError}>{error}</div>}

          <button
            type="submit"
            className={css.createButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateUserModal;
