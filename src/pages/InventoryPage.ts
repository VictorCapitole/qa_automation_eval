import type { Locator, Page } from '@playwright/test';
import { productItem } from './productItem';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  item(name: string): Locator {
    return productItem(this.page, name);
  }

  async addToCart(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
