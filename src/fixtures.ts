import { test as base } from '@playwright/test';
import { PokemonApiClient } from './api/PokemonApiClient';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';

interface Fixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  pokemonApi: PokemonApiClient;
}

/** Cada fixture se crea por test, por lo que no se comparte estado entre tests paralelos. */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  pokemonApi: async ({ request }, use) => use(new PokemonApiClient(request)),
});

export { expect } from '@playwright/test';
