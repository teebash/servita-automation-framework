import * as path from 'path';
import * as dotenv from 'dotenv';

const testEnv = process.env.TEST_ENV ?? 'local';

// Load environment-specific .env file first (e.g. .env.dev, .env.uat)
// then fall back to .env for shared defaults like REQRES_API_KEY
const envFile = testEnv === 'local' ? '.env' : `.env.${testEnv}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile), quiet: true });

// Always load base .env as fallback — values already set above won't be overwritten
dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });
