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
import { PRODUCT_NAMES } from '../../ui/data';
import { generateCheckoutInfo } from '../../core/utils';

describe('Multiple Items Checkout', () => {
  jest.retryTimes(1, { logErrorsBeforeRetry: true });

  let session: BrowserSession;
  let page: Page;
  let authFlow: AuthFlow;
  let checkoutFlow: CheckoutFlow;

  const selectedItems = [
    PRODUCT_NAMES.BACKPACK,
    PRODUCT_NAMES.BIKE_LIGHT,
    PRODUCT_NAMES.BOLT_SHIRT,
  ];

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

  it('@regression should complete checkout with multiple items', async () => {
    // Login
    await authFlow.loginAs(USERS.STANDARD);
    const productsPage = checkoutFlow.getProductsPage();
    await assertOnProductsPage(productsPage);

    // Add multiple items to cart
    await productsPage.addMultipleItemsToCart(selectedItems);
    await assertCartBadgeCount(productsPage, selectedItems.length);

    // Go to cart and verify all items are present
    await productsPage.goToCart();
    const cartPage = checkoutFlow.getCartPage();
    await assertCartItemCount(cartPage, selectedItems.length);
    await assertCartContainsItems(cartPage, selectedItems);

    // Click checkout
    await cartPage.clickCheckout();
    const checkoutPage = checkoutFlow.getCheckoutPage();
    await assertCheckoutStepOneVisible(checkoutPage);

    // Enter shipping details
    const shippingInfo = generateCheckoutInfo();
    await checkoutPage.fillShippingInfo(shippingInfo);
    await checkoutPage.clickContinue();

    // Verify overview shows all items
    const overviewPage = checkoutFlow.getOverviewPage();
    await assertCheckoutOverviewVisible(overviewPage);
    const overviewItems = await overviewPage.getCartItemNames();
    for (const item of selectedItems) {
      expect(overviewItems).toContain(item);
    }
    expect(overviewItems).toHaveLength(selectedItems.length);

    // Complete order
    await overviewPage.clickFinish();
    const completePage = checkoutFlow.getCompletePage();
    await assertOrderComplete(completePage);
  });
});
