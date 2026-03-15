import { Page } from 'playwright';
import { BasePage } from './BasePage';
import type { UserCredentials } from '../../core/types';

export class LoginPage extends BasePage {
  private readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
  };

  constructor(page: Page) {
    super(page);
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.page.fill(this.selectors.usernameInput, credentials.username);
    await this.page.fill(this.selectors.passwordInput, credentials.password);
    await this.page.click(this.selectors.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    const element = this.page.locator(this.selectors.errorMessage);
    return element.textContent() as Promise<string>;
  }

  async isErrorVisible(): Promise<boolean> {
    return this.page.locator(this.selectors.errorMessage).isVisible();
  }

  async isLoginFormVisible(): Promise<boolean> {
    return this.page.locator(this.selectors.loginButton).isVisible();
  }
}
