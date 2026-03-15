export interface EnvironmentConfig {
  uiBaseUrl: string;
  apiBaseUrl: string;
  reqresApiKey: string;
  apiUserAgent: string;
  headless: boolean;
  ci: boolean;
  defaultTimeout: number;
}

function getEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function getBoolEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

export const env: EnvironmentConfig = {
  uiBaseUrl: getEnvOrDefault('UI_BASE_URL', 'https://www.saucedemo.com'),
  apiBaseUrl: getEnvOrDefault('API_BASE_URL', 'https://reqres.in'),
  reqresApiKey: getEnvOrDefault('REQRES_API_KEY', ''),
  apiUserAgent: getEnvOrDefault('API_USER_AGENT', 'ServitaTestFramework/1.0'),
  headless: getBoolEnv('HEADLESS', true),
  ci: getBoolEnv('CI', false),
  defaultTimeout: parseInt(getEnvOrDefault('DEFAULT_TIMEOUT', '30000'), 10),
};

/** Active environment name — for logging/reporting purposes */
export const activeEnvironment = process.env.TEST_ENV ?? 'local';
