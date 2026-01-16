import { Activity } from "react";
import {
  Navigate,
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthPageHeader from "@/components/Auth/AuthPageHeader";
import Input from "@/components/Auth/Input";
import Button from "@/components/Auth/Button";
import {
  verifyCodeSchema,
  type VerifyCodeFormData,
} from "@/features/forgot-password/validation/forgotPasswordSchema";
import { verifyResetCode } from "@/api/auth";
import { handleAxiosError } from "@/utils/axiosError";
import css from "./index.module.css";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onChange",
    defaultValues: {
      email: email!,
    },
  });

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleBack = () => {
    navigate("/forgot-password");
  };

  const onSubmit = async (data: VerifyCodeFormData) => {
    clearErrors("root");

    try {
      const response = await verifyResetCode({
        email: data.email || email,
        code: data.code,
      });
      navigate({
        pathname: "/reset-password",
        search: createSearchParams({ token: response.resetToken }).toString(),
      });
    } catch (err: unknown) {
      const errorMsg = handleAxiosError(
        err,
        "Failed to verify code. Please try again."
      );

      setError("root", {
        message: errorMsg,
      });
    }
  };

  return (
    <>
      <AuthPageHeader
        title="Verify code"
        description="Enter the 6-digit code sent to your email"
      />
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...field}
                error={!!errors.code}
              />
            )}
          />
          {errors.code && (
            <div className={css.error}>{errors.code.message}</div>
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
            Verify
          </Button>
        </div>
      </form>
    </>
  );
}
