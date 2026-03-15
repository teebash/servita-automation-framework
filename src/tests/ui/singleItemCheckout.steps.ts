import { loadFeature, defineFeature } from 'jest-cucumber';
import { Page } from 'playwright';
import { launchBrowser, closeBrowser, BrowserSession, captureScreenshotOnFailure } from '../../core/helpers';
import { AuthFlow, CheckoutFlow } from '../../ui/flows';
import {
  assertOnProductsPage,
  assertCartContainsItems,
  assertCartItemCount,
  assertCheckoutStepOneVisible,
  assertCheckoutOverviewVisible,
  assertOrderComplete,
  assertCartBadgeCount,
} from '../../ui/assertions';
import { USERS } from '../../core/constants';
import { generateCheckoutInfo } from '../../core/utils';

const feature = loadFeature('./src/tests/ui/features/singleItemCheckout.feature');

defineFeature(feature, (test) => {
  jest.retryTimes(1, { logErrorsBeforeRetry: true });

  let session: BrowserSession;
  let page: Page;
  let authFlow: AuthFlow;
  let checkoutFlow: CheckoutFlow;

  beforeEach(async () => {
    session = await launchBrowser();
    page = session.page;
    authFlow = new AuthFlow(page);
    checkoutFlow = new CheckoutFlow(page);
  });

  afterEach(async () => {
    if ((global as Record<string, unknown>).__TEST_FAILED__) {
      await captureScreenshotOnFailure(session.page);
    }
    await closeBrowser(session);
  });

  test('Complete checkout with a single item', ({ given, when, then, and }) => {
    given('the user is logged in as a standard user', async () => {
      await authFlow.loginAs(USERS.STANDARD);
      const productsPage = checkoutFlow.getProductsPage();
      await assertOnProductsPage(productsPage);
    });

    when(/^the user adds "(.*)" to the cart$/, async (itemName: string) => {
      const productsPage = checkoutFlow.getProductsPage();
      await productsPage.addItemToCart(itemName);
    });

    and(/^the cart badge shows (\d+) item$/, async (count: string) => {
      const productsPage = checkoutFlow.getProductsPage();
      await assertCartBadgeCount(productsPage, parseInt(count, 10));
    });

    and('the user navigates to the cart', async () => {
      const productsPage = checkoutFlow.getProductsPage();
      await productsPage.goToCart();
    });

    then(/^the cart should contain (\d+) item$/, async (count: string) => {
      const cartPage = checkoutFlow.getCartPage();
      await assertCartItemCount(cartPage, parseInt(count, 10));
    });

    and(/^the cart should contain "(.*)"$/, async (itemName: string) => {
      const cartPage = checkoutFlow.getCartPage();
      await assertCartContainsItems(cartPage, [itemName]);
    });

    when('the user proceeds to checkout', async () => {
      const cartPage = checkoutFlow.getCartPage();
      await cartPage.clickCheckout();
      const checkoutPage = checkoutFlow.getCheckoutPage();
      await assertCheckoutStepOneVisible(checkoutPage);
    });

    and('the user enters their shipping information', async () => {
      const checkoutPage = checkoutFlow.getCheckoutPage();
      const shippingInfo = generateCheckoutInfo();
      await checkoutPage.fillShippingInfo(shippingInfo);
    });

    and('the user continues to the overview', async () => {
      const checkoutPage = checkoutFlow.getCheckoutPage();
      await checkoutPage.clickContinue();
    });

    then(/^the overview should display "(.*)"$/, async (itemName: string) => {
      const overviewPage = checkoutFlow.getOverviewPage();
      await assertCheckoutOverviewVisible(overviewPage);
      const overviewItems = await overviewPage.getCartItemNames();
      expect(overviewItems).toContain(itemName);
    });

    when('the user finishes the order', async () => {
      const overviewPage = checkoutFlow.getOverviewPage();
      await overviewPage.clickFinish();
    });

    then('the order should be confirmed as complete', async () => {
      const completePage = checkoutFlow.getCompletePage();
      await assertOrderComplete(completePage);
    });
  });
});
