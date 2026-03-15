import { env } from './env';

export const testConfig = {
  ui: {
    baseUrl: env.uiBaseUrl,
    timeout: env.defaultTimeout,
    headless: env.headless,
  },
  api: {
    baseUrl: env.apiBaseUrl,
    apiKey: env.reqresApiKey,
    userAgent: env.apiUserAgent,
    timeout: 10000,
  },
  browser: {
    headless: env.headless,
    slowMo: env.ci ? 0 : 50,
  },
} as const;
