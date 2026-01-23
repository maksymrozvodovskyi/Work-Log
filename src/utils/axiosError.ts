type AxiosErrorType = {
  response?: {
    data?: { message?: string };
  };
};

export function handleAxiosError(
  error: unknown,
  defaultMessage: string
): string {
  if (!error) {
    return defaultMessage;
  }
  
  const axiosError = error as AxiosErrorType;
  return axiosError.response?.data?.message || defaultMessage;
}
