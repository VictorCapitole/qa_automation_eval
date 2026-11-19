import { expect, test } from '../../src/fixtures';
import { products } from '../../src/data/testData';

const product = products.backpack;

test.beforeEach(async ({ inventoryPage }) => {
  await inventoryPage.goto();
  await expect(inventoryPage.title, 'la sesión guardada debe seguir siendo válida').toHaveText('Products');
  await expect(inventoryPage.cartBadge, 'precondición: el carrito debe empezar vacío').toBeHidden();
});

test.describe('Req02 - Añadir producto al carrito', () => {
  test('FE-02 el producto añadido aparece en el carrito', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(product.name);

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.item(product.name).getByRole('button', { name: 'Remove' })).toBeVisible();

    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.item(product.name)).toContainText(product.price);
  });
});

test.describe('Req03 - Eliminar producto del carrito', () => {
  test('FE-03 el producto eliminado desaparece y el carrito queda vacío', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(product.name);
    await inventoryPage.openCart();
    await expect(cartPage.item(product.name)).toBeVisible();

    await cartPage.removeProduct(product.name);

    await expect(cartPage.item(product.name)).toHaveCount(0);
    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
