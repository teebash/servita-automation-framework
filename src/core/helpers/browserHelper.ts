import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { testConfig } from '../../config';

export interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

export async function launchBrowser(): Promise<BrowserSession> {
  const browser = await chromium.launch({
    headless: testConfig.browser.headless,
    slowMo: testConfig.browser.slowMo,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(testConfig.ui.timeout);

  await page.goto(testConfig.ui.baseUrl);

  return { browser, context, page };
}

export async function closeBrowser(session: BrowserSession): Promise<void> {
  await session.context.close();
  await session.browser.close();
}
