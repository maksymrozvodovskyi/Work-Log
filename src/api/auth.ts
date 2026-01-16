import axiosInstance from "@/lib/apiClient";
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/Auth";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return data;
};

export const forgotPassword = async (
  request: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const { data } = await axiosInstance.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    request
  );

  return data;
};

export const verifyResetCode = async (
  request: VerifyResetCodeRequest
): Promise<VerifyResetCodeResponse> => {
  const { data } = await axiosInstance.post<VerifyResetCodeResponse>(
    "/auth/verify-reset-code",
    request
  );

  return data;
};

export const resetPassword = async (
  newPassword: string,
  resetToken: string
): Promise<ResetPasswordResponse> => {
  const { data } = await axiosInstance.post<ResetPasswordResponse>(
    "/auth/reset-password",
    { newPassword } as ResetPasswordRequest,
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    }
  );

  return data;
};
