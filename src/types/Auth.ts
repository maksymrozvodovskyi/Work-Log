export type LoginRequestType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

export type UserType = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
};

export type AuthStateType = {
  user: UserType | null;
  accessToken: string | null;
  isAuthenticated: boolean;
};

export type ForgotPasswordRequestType = {
  email: string;
};

export type ForgotPasswordResponseType = {
  message: string;
};

export type VerifyResetCodeRequestType = {
  email: string;
  code: string;
};

export type VerifyResetCodeResponseType = {
  resetToken: string;
};

export type ResetPasswordRequestType = {
  newPassword: string;
};

export type ResetPasswordResponseType = {
  message: string;
};
