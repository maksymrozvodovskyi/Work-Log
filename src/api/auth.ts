import axiosInstance from "@/lib/apiClient";
import type {
  LoginRequestType,
  LoginResponseType,
  ForgotPasswordRequestType,
  ForgotPasswordResponseType,
  VerifyResetCodeRequestType,
  VerifyResetCodeResponseType,
  ResetPasswordRequestType,
  ResetPasswordResponseType,
} from "@/types/Auth";

export const login = async (
  credentials: LoginRequestType
): Promise<LoginResponseType> => {
  const { data } = await axiosInstance.post<LoginResponseType>(
    "/auth/login",
    credentials
  );

  return data;
};

export const forgotPassword = async (
  request: ForgotPasswordRequestType
): Promise<ForgotPasswordResponseType> => {
  const { data } = await axiosInstance.post<ForgotPasswordResponseType>(
    "/auth/forgot-password",
    request
  );

  return data;
};

export const verifyResetCode = async (
  request: VerifyResetCodeRequestType
): Promise<VerifyResetCodeResponseType> => {
  const { data } = await axiosInstance.post<VerifyResetCodeResponseType>(
    "/auth/verify-reset-code",
    request
  );

  return data;
};

export const resetPassword = async (
  newPassword: string,
  resetToken: string
): Promise<ResetPasswordResponseType> => {
  const { data } = await axiosInstance.post<ResetPasswordResponseType>(
    "/auth/reset-password",
    { newPassword } as ResetPasswordRequestType,
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    }
  );

  return data;
};
