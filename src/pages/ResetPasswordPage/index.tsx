import { Activity } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/components/Auth/Logo";
import Input from "@/components/Auth/Input";
import Button from "@/components/Auth/Button";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/forgot-password/validation/forgotPasswordSchema";
import { resetPassword } from "@/api/auth";
import { getAxiosErrorMessage } from "@/utils/axiosError";
import css from "./index.module.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  if (!token) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleBack = () => {
    navigate("/forgot-password");
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    clearErrors("root");

    try {
      await resetPassword(data.newPassword, token!);
      navigate("/login");
    } catch (err: unknown) {
      const errorMsg = getAxiosErrorMessage(
        err,
        "Failed to reset password. Please try again."
      );

      setError("root", {
        message: errorMsg,
      });
    }
  };

  return (
    <div className={css.container}>
      <div className={css.content}>
        <Logo />

        <div className={css.textContent}>
          <h1 className={css.title}>Reset password</h1>
          <p className={css.description}>Enter your new password</p>
        </div>

        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  placeholder="New password"
                  {...field}
                  error={!!errors.newPassword}
                />
              )}
            />
            {errors.newPassword && (
              <div className={css.error}>{errors.newPassword.message}</div>
            )}
          </div>

          <Activity mode={errors.root ? "visible" : "hidden"}>
            <div className={css.error}>{errors.root?.message}</div>
          </Activity>

          <div className={css.buttons}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              className={css.backButton}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
