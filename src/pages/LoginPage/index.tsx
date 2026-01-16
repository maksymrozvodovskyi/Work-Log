import { Activity } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Auth/Input";
import Button from "@/components/Auth/Button";
import {
  loginSchema,
  type LoginFormData,
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const onSubmit = async (data: LoginFormData) => {
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
    <>
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
          >
            Forgot password
          </Button>
          <Button
            type="submit"
            variant="primary"
            className={css.signInButton}
            disabled={isSubmitting}
          >
            Sign in
          </Button>
        </div>
      </form>
    </>
  );
}
