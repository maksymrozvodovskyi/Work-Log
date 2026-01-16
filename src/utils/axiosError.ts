type AxiosError = {
  response?: {
    data?: { message?: string };
  };
};

export function getAxiosErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  const axiosError = error as AxiosError;
  return axiosError.response?.data?.message || defaultMessage;
}
