import { expect, test as setup } from '../src/fixtures';
import { STORAGE_STATE, users } from '../src/data/testData';


setup('autenticación como standard_user', async ({ page, loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard);

  await expect(inventoryPage.title).toHaveText('Products');
  await expect(inventoryPage.cartBadge, 'la sesión guardada debe empezar con el carrito vacío').toBeHidden();

  await page.context().storageState({ path: STORAGE_STATE });
});
