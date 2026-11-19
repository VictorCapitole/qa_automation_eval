import type { Locator, Page } from '@playwright/test';
import type { Credentials } from '../data/testData';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.error = page.getByTestId('error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login({ username, password }: Credentials): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
