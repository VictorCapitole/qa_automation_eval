import { expect, test } from '../../src/fixtures';
import { users } from '../../src/data/testData';


test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Req01 - Inicio de sesión', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('FE-01 el usuario estándar inicia sesión y accede al inventario', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).not.toHaveCount(0);
  });

  test('FE-01b una contraseña incorrecta se rechaza con un error', async ({ page, loginPage }) => {
    await loginPage.login(users.wrongPassword);

    await expect(loginPage.error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).not.toHaveURL(/inventory/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('FE-01c un usuario bloqueado no puede iniciar sesión', async ({ page, loginPage }) => {
    await loginPage.login(users.lockedOut);

    await expect(loginPage.error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
