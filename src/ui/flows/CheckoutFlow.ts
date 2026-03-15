import { Page } from 'playwright';
import { ProductsPage, CartPage, CheckoutPage, CheckoutOverviewPage, CheckoutCompletePage } from '../pages';
import type { CheckoutInfo } from '../../core/types';

export class CheckoutFlow {
  private readonly productsPage: ProductsPage;
  private readonly cartPage: CartPage;
  private readonly checkoutPage: CheckoutPage;
  private readonly overviewPage: CheckoutOverviewPage;
  private readonly completePage: CheckoutCompletePage;

  constructor(private readonly page: Page) {
    this.productsPage = new ProductsPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.overviewPage = new CheckoutOverviewPage(page);
    this.completePage = new CheckoutCompletePage(page);
  }

  async addSingleItemAndCheckout(itemName: string, shippingInfo: CheckoutInfo): Promise<void> {
    await this.productsPage.addItemToCart(itemName);
    await this.productsPage.goToCart();
    await this.cartPage.clickCheckout();
    await this.checkoutPage.fillShippingInfo(shippingInfo);
    await this.checkoutPage.clickContinue();
    await this.overviewPage.clickFinish();
  }

  async addMultipleItemsAndCheckout(itemNames: string[], shippingInfo: CheckoutInfo): Promise<void> {
    await this.productsPage.addMultipleItemsToCart(itemNames);
    await this.productsPage.goToCart();
    await this.cartPage.clickCheckout();
    await this.checkoutPage.fillShippingInfo(shippingInfo);
    await this.checkoutPage.clickContinue();
    await this.overviewPage.clickFinish();
  }

  getProductsPage(): ProductsPage {
    return this.productsPage;
  }

  getCartPage(): CartPage {
    return this.cartPage;
  }

  getCheckoutPage(): CheckoutPage {
    return this.checkoutPage;
  }

  getOverviewPage(): CheckoutOverviewPage {
    return this.overviewPage;
  }

  getCompletePage(): CheckoutCompletePage {
    return this.completePage;
  }
}
