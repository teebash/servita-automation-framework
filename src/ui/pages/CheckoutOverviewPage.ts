import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  private readonly selectors = {
    title: '[data-test="title"]',
    cartItem: '[data-test="inventory-item"]',
    cartItemName: '[data-test="inventory-item-name"]',
    cartItemPrice: '[data-test="inventory-item-price"]',
    summarySubtotal: '[data-test="subtotal-label"]',
    summaryTax: '[data-test="tax-label"]',
    summaryTotal: '[data-test="total-label"]',
    finishButton: '[data-test="finish"]',
    cancelButton: '[data-test="cancel"]',
  };

  constructor(page: Page) {
    super(page);
  }

  async getPageTitle(): Promise<string> {
    return (await this.page.locator(this.selectors.title).textContent()) ?? '';
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator(this.selectors.cartItemName).allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return this.page.locator(this.selectors.cartItem).count();
  }

  async clickFinish(): Promise<void> {
    await this.page.click(this.selectors.finishButton);
  }

  async getTotalPrice(): Promise<string> {
    return (await this.page.locator(this.selectors.summaryTotal).textContent()) ?? '';
  }
}
