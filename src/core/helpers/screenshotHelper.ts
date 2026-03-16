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

  const fullName = state.currentTestName ?? 'unknown-test';
  const parts = fullName.split(' > ');
  let suiteName: string;
  let testName: string;

  if (parts.length > 1) {
    // Standard Jest describe > it format
    suiteName = parts[0];
    testName = parts.slice(1).join('_');
  } else {
    // jest-cucumber flat format: "Feature name @tag Scenario title"
    const tagIndex = fullName.indexOf('@');
    if (tagIndex > 0) {
      suiteName = fullName.substring(0, tagIndex).trim();
      testName = fullName.substring(tagIndex).trim();
    } else {
      suiteName = fullName;
      testName = 'failed';
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${sanitiseFilename(suiteName)}--${sanitiseFilename(testName)}--${timestamp}.png`;

  ensureScreenshotsDir();
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: true });
}
