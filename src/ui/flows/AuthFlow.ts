import { Page } from 'playwright';
import { LoginPage } from '../pages';
import { HeaderComponent } from '../pages';
import { URLS } from '../../core/constants';
import type { UserCredentials } from '../../core/types';

export class AuthFlow {
  private readonly loginPage: LoginPage;
  private readonly header: HeaderComponent;

  constructor(private readonly page: Page) {
    this.loginPage = new LoginPage(page);
    this.header = new HeaderComponent(page);
  }

  async loginAs(credentials: UserCredentials): Promise<void> {
    await this.loginPage.login(credentials);
    await this.page.waitForURL(`**${URLS.INVENTORY}`, { timeout: 10000 });
  }

  async logout(): Promise<void> {
    await this.header.logout();
    await this.page.waitForURL(`**${URLS.LOGIN}`, { timeout: 10000 });
  }
}
