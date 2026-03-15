import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly selectors = {
    title: '[data-test="title"]',
    cartItem: '[data-test="inventory-item"]',
    cartItemName: '[data-test="inventory-item-name"]',
    cartItemPrice: '[data-test="inventory-item-price"]',
    checkoutButton: '[data-test="checkout"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    removeButton: (itemName: string) =>
      `[data-test="remove-${itemName.toLowerCase().replace(/ /g, '-')}"]`,
  };

  constructor(page: Page) {
    super(page);
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator(this.selectors.cartItemName).allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return this.page.locator(this.selectors.cartItem).count();
  }

  async getPageTitle(): Promise<string> {
    return (await this.page.locator(this.selectors.title).textContent()) ?? '';
  }

  async clickCheckout(): Promise<void> {
    await this.page.click(this.selectors.checkoutButton);
  }

  async removeItem(itemName: string): Promise<void> {
    await this.page.click(this.selectors.removeButton(itemName));
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    const names = await this.getCartItemNames();
    return names.includes(itemName);
  }
}
