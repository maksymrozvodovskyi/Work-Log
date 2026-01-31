import { Activity } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Input from "@/components/Auth/Input";
import Button from "@/components/Auth/Button";
import {
  loginSchema,
  type LoginFormDataType,
} from "@/features/login/validation/loginSchema";
import { login } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { handleAxiosError } from "@/utils/axiosError";
import css from "./index.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormDataType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const onSubmit = async (data: LoginFormDataType) => {
    clearErrors("root");

    try {
      const response = await login(data);
      setAuth(response.accessToken, response.user);
      navigate("/");
    } catch (error: unknown) {
      const errorMessage = handleAxiosError(
        error,
        "Failed to login. Please check your credentials."
      );

      setError("root", {
        message: errorMessage,
      });
    }
  };

  return (
    <form
      className={clsx(css.form, isSubmitting && css.formDisabled)}
      onSubmit={handleSubmit(onSubmit)}
    >
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
              disabled={isSubmitting}
            />
          )}
        />
        <Activity mode={errors.email ? "visible" : "hidden"}>
          <div className={css.error}>{errors.email?.message}</div>
        </Activity>
      </div>

      <div>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              type="password"
              placeholder="Password"
              {...field}
              error={!!errors.password}
              disabled={isSubmitting}
            />
          )}
        />
        <Activity mode={errors.password ? "visible" : "hidden"}>
          <div className={css.error}>{errors.password?.message}</div>
        </Activity>
      </div>

      <Activity mode={errors.root ? "visible" : "hidden"}>
        <div className={css.error}>{errors.root?.message}</div>
      </Activity>

      <div className={css.buttons}>
        <Button
          type="button"
          variant="secondary"
          onClick={handleForgotPassword}
          disabled={isSubmitting}
        >
          Forgot password
        </Button>
        <Button
          type="submit"
          variant="primary"
          className={css.signInButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className={css.buttonContent}>
              <span className={css.buttonLoader}>
                <span className={css.loaderDot}></span>
                <span className={css.loaderDot}></span>
                <span className={css.loaderDot}></span>
              </span>
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </div>
    </form>
  );
}
