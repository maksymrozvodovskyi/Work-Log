interface EnvConfig {
  apiUrl: string;
}

export const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(
      `Environment variable ${key} is required but not found. Please check your .env file.`
    );
  }

  return value;
};

export const config: EnvConfig = {
  apiUrl: getEnvVar("VITE_API_URL"),
};
