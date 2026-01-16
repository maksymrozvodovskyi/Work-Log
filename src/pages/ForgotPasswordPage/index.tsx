import { Activity } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthPageHeader from "@/components/Auth/AuthPageHeader";
import Input from "@/components/Auth/Input";
import Button from "@/components/Auth/Button";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/forgot-password/validation/forgotPasswordSchema";
import { forgotPassword } from "@/api/auth";
import { handleAxiosError } from "@/utils/axiosError";
import css from "./index.module.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const handleBackToSignIn = () => {
    navigate("/login");
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearErrors("root");

    try {
      await forgotPassword({ email: data.email });
      navigate({
        pathname: "/verify-code",
        search: createSearchParams({ email: data.email }).toString(),
      });
    } catch (err: unknown) {
      const errorMsg = handleAxiosError(
        err,
        "Failed to send code. Please try again."
      );

      setError("root", {
        message: errorMsg,
      });
    }
  };

  return (
    <>
      <AuthPageHeader
        title="Forgot password"
        description="Enter the email address associated with your account or contact your admin"
      />
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                placeholder="Email"
                {...field}
                error={!!errors.email}
              />
            )}
          />
          {errors.email && (
            <div className={css.error}>{errors.email.message}</div>
          )}
        </div>

        <Activity mode={errors.root ? "visible" : "hidden"}>
          <div className={css.error}>{errors.root?.message}</div>
        </Activity>

        <div className={css.buttons}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleBackToSignIn}
            className={css.backButton}
          >
            Back to Sign in
          </Button>
          <Button
            type="submit"
            variant="primary"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            Send
          </Button>
        </div>
      </form>
    </>
  );
}
