interface EnvConfig {
  apiUrl: string;
  accessToken: string;
}

export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];

  if (!value && !defaultValue) {
    throw new Error(
      `Environment variable ${key} is required but not found. Please check your .env file.`
    );
  }

  return value || defaultValue!;
};

export const config: EnvConfig = {
  apiUrl: getEnvVar("VITE_API_URL", "http://localhost:3000"),
  accessToken: getEnvVar("VITE_ACCESS_TOKEN"),
};
