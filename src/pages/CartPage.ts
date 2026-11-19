import type { Locator, Page } from '@playwright/test';
import { productItem } from './productItem';

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  item(name: string): Locator {
    return productItem(this.page, name);
  }

  async removeProduct(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
