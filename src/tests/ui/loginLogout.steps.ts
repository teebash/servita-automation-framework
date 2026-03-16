import { loadFeature, defineFeature } from 'jest-cucumber';
import { Page } from 'playwright';
import { launchBrowser, closeBrowser, BrowserSession, captureScreenshotOnFailure } from '../../core/helpers';
import { AuthFlow } from '../../ui/flows';
import { LoginPage, ProductsPage } from '../../ui/pages';
import { assertOnProductsPage, assertLoginFormVisible } from '../../ui/assertions';
import { USERS } from '../../core/constants';

const feature = loadFeature('./src/tests/ui/features/loginLogout.feature');

defineFeature(feature, (test) => {
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

  test('Successful login with standard user', ({ given, when, then }) => {
    given('the user is on the login page', () => {
      // Browser launched to login page in beforeEach
    });

    when('the user logs in as a standard user', async () => {
      await authFlow.loginAs(USERS.STANDARD);
    });

    then('they should be redirected to the Products page', async () => {
      await assertOnProductsPage(productsPage);
    });
  });

  test('Successful logout returns to login page', ({ given, when, then, and }) => {
    given('the user is on the login page', () => {
      // Browser launched to login page in beforeEach
    });

    and('the user logs in as a standard user', async () => {
      await authFlow.loginAs(USERS.STANDARD);
      await assertOnProductsPage(productsPage);
    });

    when('the user logs out', async () => {
      await authFlow.logout();
    });

    then('the login form should be visible', async () => {
      await assertLoginFormVisible(loginPage);
    });

    and('the URL should contain "/"', () => {
      expect(page.url()).toContain('/');
    });
  });

  test('Locked out user sees an error message', ({ given, when, then, and }) => {
    given('the user is on the login page', () => {
      // Browser launched to login page in beforeEach
    });

    when('the user attempts to login as a locked out user', async () => {
      await loginPage.login(USERS.LOCKED_OUT);
    });

    then('an error message should be displayed', async () => {
      const isError = await loginPage.isErrorVisible();
      expect(isError).toBe(true);
    });

    and('the error message should contain "locked out"', async () => {
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('locked out');
    });
  });
});
