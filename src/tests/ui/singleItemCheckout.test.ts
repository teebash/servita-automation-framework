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

describe('Single Item Checkout', () => {
  jest.retryTimes(1, { logErrorsBeforeRetry: true });

  let session: BrowserSession;
  let page: Page;
  let authFlow: AuthFlow;
  let checkoutFlow: CheckoutFlow;

  const selectedItem = PRODUCT_NAMES.BACKPACK;

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

  it('@smoke @regression should complete checkout with a single item', async () => {
    // Login
    await authFlow.loginAs(USERS.STANDARD);
    const productsPage = checkoutFlow.getProductsPage();
    await assertOnProductsPage(productsPage);

    // Add item to cart
    await productsPage.addItemToCart(selectedItem);
    await assertCartBadgeCount(productsPage, 1);

    // Go to cart and verify item
    await productsPage.goToCart();
    const cartPage = checkoutFlow.getCartPage();
    await assertCartItemCount(cartPage, 1);
    await assertCartContainsItems(cartPage, [selectedItem]);

    // Click checkout
    await cartPage.clickCheckout();
    const checkoutPage = checkoutFlow.getCheckoutPage();
    await assertCheckoutStepOneVisible(checkoutPage);

    // Enter shipping details
    const shippingInfo = generateCheckoutInfo();
    await checkoutPage.fillShippingInfo(shippingInfo);
    await checkoutPage.clickContinue();

    // Verify overview
    const overviewPage = checkoutFlow.getOverviewPage();
    await assertCheckoutOverviewVisible(overviewPage);
    const overviewItems = await overviewPage.getCartItemNames();
    expect(overviewItems).toContain(selectedItem);

    // Complete order
    await overviewPage.clickFinish();
    const completePage = checkoutFlow.getCompletePage();
    await assertOrderComplete(completePage);
  });
});
