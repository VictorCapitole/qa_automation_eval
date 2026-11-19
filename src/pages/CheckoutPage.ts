import type { Locator, Page } from '@playwright/test';
import type { CustomerInfo } from '../data/testData';
import { productItem } from './productItem';

/** Cubre los tres pasos del checkout: información, resumen y confirmación. */
export class CheckoutPage {
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.error = page.getByTestId('error');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
  }

  item(name: string): Locator {
    return productItem(this.page, name);
  }

  async fillInformation({ firstName, lastName, postalCode }: CustomerInfo): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
