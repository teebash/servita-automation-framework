import { Page } from 'playwright';

export class HeaderComponent {
  private readonly selectors = {
    burgerMenuButton: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
    closeMenuButton: '#react-burger-cross-btn',
    menuWrap: '.bm-menu-wrap',
  };

  constructor(private readonly page: Page) {}

  async openMenu(): Promise<void> {
    await this.page.click(this.selectors.burgerMenuButton);
    await this.page.waitForSelector(this.selectors.logoutLink, { state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.page.click(this.selectors.logoutLink);
  }
}
