import { Page } from 'playwright';
import { BasePage } from './BasePage';
import type { CheckoutInfo } from '../../core/types';

export class CheckoutPage extends BasePage {
  private readonly selectors = {
    title: '[data-test="title"]',
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    errorMessage: '[data-test="error"]',
  };

  constructor(page: Page) {
    super(page);
  }

  async getPageTitle(): Promise<string> {
    return (await this.page.locator(this.selectors.title).textContent()) ?? '';
  }

  async fillShippingInfo(info: CheckoutInfo): Promise<void> {
    await this.page.fill(this.selectors.firstNameInput, info.firstName);
    await this.page.fill(this.selectors.lastNameInput, info.lastName);
    await this.page.fill(this.selectors.postalCodeInput, info.postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.page.click(this.selectors.continueButton);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.page.locator(this.selectors.errorMessage).isVisible();
  }
}
