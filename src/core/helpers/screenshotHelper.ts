import * as path from 'path';
import * as fs from 'fs';
import type { Page } from 'playwright';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'reports', 'screenshots');

function ensureScreenshotsDir(): void {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
}

function sanitiseFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 120);
}

/**
 * Captures a screenshot labelled with the test suite and test name.
 * Call from afterEach — only takes a screenshot when the current test has failed.
 */
export async function captureScreenshotOnFailure(page: Page): Promise<void> {
  const state = expect.getState();

  if (!page || page.isClosed()) return;

  const suiteName = sanitiseFilename(state.currentTestName?.split(' > ')[0] ?? 'unknown-suite');
  const testName = sanitiseFilename(state.currentTestName ?? 'unknown-test');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${suiteName}--${testName}--${timestamp}.png`;

  ensureScreenshotsDir();
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: true });
}
