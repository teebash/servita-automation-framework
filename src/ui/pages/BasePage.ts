import { Page } from 'playwright';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async navigateTo(path: string): Promise<void> {
    const baseUrl = this.page.url().split('/').slice(0, 3).join('/');
    await this.page.goto(`${baseUrl}${path}`);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForUrl(urlPart: string): Promise<void> {
    await this.page.waitForURL(`**${urlPart}`, { timeout: 10000 });
  }
}
