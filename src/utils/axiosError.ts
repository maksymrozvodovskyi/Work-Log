type AxiosErrorType = {
  response?: {
    data?: {
      message?: string;
      error?: string;
      data?: {
        message?: string;
      };
      issues?: Array<{
        path: (string | number)[];
        message: string;
      }>;
    };
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
  const responseData = axiosError.response?.data;
  
  if (!responseData) {
    return defaultMessage;
  }
  
  if (responseData.data?.message) {
    return responseData.data.message;
  }
  
  if (responseData.message) {
    return responseData.message;
  }
  
  if (responseData.error) {
    return responseData.error;
  }
  
  if (responseData.issues && Array.isArray(responseData.issues) && responseData.issues.length > 0) {
    const formattedIssues = responseData.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
        return `${path}${issue.message}`;
      })
      .join('; ');
    return formattedIssues;
  }
  
  return defaultMessage;
}
