import { expect, test } from '../../src/fixtures';
import { customer, products } from '../../src/data/testData';

const product = products.backpack;

test.describe('Req04 - Completar un pedido', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.goto();
    await expect(inventoryPage.title, 'la sesión guardada debe seguir siendo válida').toHaveText('Products');
    await expect(inventoryPage.cartBadge, 'precondición: el carrito debe empezar vacío').toBeHidden();

    await inventoryPage.addToCart(product.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('FE-04 el pedido se completa y se confirma', async ({ inventoryPage, checkoutPage }) => {
    await checkoutPage.fillInformation(customer);
    await checkoutPage.continue();

    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.item(product.name)).toContainText(product.price);

    await checkoutPage.finish();

    await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.completeText).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('FE-04b el checkout exige los datos del cliente', async ({ checkoutPage }) => {
    await checkoutPage.continue();

    await expect(checkoutPage.error).toHaveText('Error: First Name is required');
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });
});
