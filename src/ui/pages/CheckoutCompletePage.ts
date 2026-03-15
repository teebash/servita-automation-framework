import { Page } from 'playwright';
import { BasePage } from './BasePage';
import { MESSAGES } from '../../core/constants';

export class CheckoutCompletePage extends BasePage {
  private readonly selectors = {
    title: '[data-test="title"]',
    completeHeader: '[data-test="complete-header"]',
    completeText: '[data-test="complete-text"]',
    backHomeButton: '[data-test="back-to-products"]',
  };

  constructor(page: Page) {
    super(page);
  }

  async getPageTitle(): Promise<string> {
    return (await this.page.locator(this.selectors.title).textContent()) ?? '';
  }

  async getCompleteHeader(): Promise<string> {
    return (await this.page.locator(this.selectors.completeHeader).textContent()) ?? '';
  }

  async getCompleteText(): Promise<string> {
    return (await this.page.locator(this.selectors.completeText).textContent()) ?? '';
  }

  async isOrderComplete(): Promise<boolean> {
    const header = await this.getCompleteHeader();
    return header === MESSAGES.ORDER_COMPLETE_HEADER;
  }

  async clickBackHome(): Promise<void> {
    await this.page.click(this.selectors.backHomeButton);
  }
}
