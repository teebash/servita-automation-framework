import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  private readonly selectors = {
    title: '[data-test="title"]',
    inventoryItem: '[data-test="inventory-item"]',
    inventoryItemName: '[data-test="inventory-item-name"]',
    addToCartButton: (itemName: string) =>
      `[data-test="add-to-cart-${itemName.toLowerCase().replace(/ /g, '-')}"]`,
    removeButton: (itemName: string) =>
      `[data-test="remove-${itemName.toLowerCase().replace(/ /g, '-')}"]`,
    shoppingCartBadge: '[data-test="shopping-cart-badge"]',
    shoppingCartLink: '[data-test="shopping-cart-link"]',
  };

  constructor(page: Page) {
    super(page);
  }

  async isOnProductsPage(): Promise<boolean> {
    const title = this.page.locator(this.selectors.title);
    const text = await title.textContent();
    return text === 'Products';
  }

  async getPageTitle(): Promise<string> {
    return (await this.page.locator(this.selectors.title).textContent()) ?? '';
  }

  async addItemToCart(itemName: string): Promise<void> {
    await this.page.click(this.selectors.addToCartButton(itemName));
  }

  async addMultipleItemsToCart(itemNames: string[]): Promise<void> {
    for (const name of itemNames) {
      await this.addItemToCart(name);
    }
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator(this.selectors.shoppingCartBadge);
    if (!(await badge.isVisible())) return 0;
    const text = await badge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async goToCart(): Promise<void> {
    await this.page.click(this.selectors.shoppingCartLink);
  }

  async getAllProductNames(): Promise<string[]> {
    const items = this.page.locator(this.selectors.inventoryItemName);
    return items.allTextContents();
  }
}
