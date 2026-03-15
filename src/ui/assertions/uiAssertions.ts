import { ProductsPage, CartPage, CheckoutPage, CheckoutOverviewPage, CheckoutCompletePage, LoginPage } from '../pages';
import { MESSAGES } from '../../core/constants';

export async function assertOnProductsPage(productsPage: ProductsPage): Promise<void> {
  const title = await productsPage.getPageTitle();
  expect(title).toBe('Products');
}

export async function assertLoginFormVisible(loginPage: LoginPage): Promise<void> {
  const visible = await loginPage.isLoginFormVisible();
  expect(visible).toBe(true);
}

export async function assertCartContainsItems(cartPage: CartPage, expectedItems: string[]): Promise<void> {
  const cartItems = await cartPage.getCartItemNames();
  for (const item of expectedItems) {
    expect(cartItems).toContain(item);
  }
  expect(cartItems).toHaveLength(expectedItems.length);
}

export async function assertCartItemCount(cartPage: CartPage, expectedCount: number): Promise<void> {
  const count = await cartPage.getCartItemCount();
  expect(count).toBe(expectedCount);
}

export async function assertCheckoutStepOneVisible(checkoutPage: CheckoutPage): Promise<void> {
  const title = await checkoutPage.getPageTitle();
  expect(title).toBe('Checkout: Your Information');
}

export async function assertCheckoutOverviewVisible(overviewPage: CheckoutOverviewPage): Promise<void> {
  const title = await overviewPage.getPageTitle();
  expect(title).toBe('Checkout: Overview');
}

export async function assertOrderComplete(completePage: CheckoutCompletePage): Promise<void> {
  const title = await completePage.getPageTitle();
  expect(title).toBe(MESSAGES.CHECKOUT_COMPLETE_TITLE);

  const header = await completePage.getCompleteHeader();
  expect(header).toBe(MESSAGES.ORDER_COMPLETE_HEADER);
}

export async function assertCartBadgeCount(productsPage: ProductsPage, expected: number): Promise<void> {
  const count = await productsPage.getCartBadgeCount();
  expect(count).toBe(expected);
}
