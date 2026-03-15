import { Page } from 'playwright';
import { launchBrowser, closeBrowser, BrowserSession, captureScreenshotOnFailure } from '../../core/helpers';
import { AuthFlow } from '../../ui/flows';
import { LoginPage, ProductsPage } from '../../ui/pages';
import { assertOnProductsPage, assertLoginFormVisible } from '../../ui/assertions';
import { USERS } from '../../core/constants';

describe('Login and Logout', () => {
  jest.retryTimes(1, { logErrorsBeforeRetry: true });

  let session: BrowserSession;
  let page: Page;
  let authFlow: AuthFlow;
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  beforeEach(async () => {
    session = await launchBrowser();
    page = session.page;
    authFlow = new AuthFlow(page);
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
  });

  afterEach(async () => {
    if ((global as Record<string, unknown>).__TEST_FAILED__) {
      await captureScreenshotOnFailure(session.page);
    }
    await closeBrowser(session);
  });

  it('@smoke @regression should login successfully with standard user and land on Products page', async () => {
    await authFlow.loginAs(USERS.STANDARD);

    await assertOnProductsPage(productsPage);
  });

  it('@regression should logout successfully and return to login page', async () => {
    await authFlow.loginAs(USERS.STANDARD);
    await assertOnProductsPage(productsPage);

    await authFlow.logout();

    await assertLoginFormVisible(loginPage);
    expect(page.url()).toContain('/');
  });

  it('@regression should show error for locked out user', async () => {
    await loginPage.login(USERS.LOCKED_OUT);

    const isError = await loginPage.isErrorVisible();
    expect(isError).toBe(true);

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('locked out');
  });
});
