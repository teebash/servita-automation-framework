import NodeEnvironment from 'jest-environment-node';
import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';

/**
 * Custom Jest environment that tracks whether the current test has failed.
 * This enables afterEach hooks to conditionally capture screenshots only on failure.
 *
 * Exposes `global.__TEST_FAILED__` (boolean) for use in test files.
 */
export default class ScreenshotEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  async handleTestEvent(event: { name: string }): Promise<void> {
    if (event.name === 'test_fn_start') {
      this.global.__TEST_FAILED__ = false;
    }
    if (event.name === 'test_fn_failure') {
      this.global.__TEST_FAILED__ = true;
    }
  }
}
