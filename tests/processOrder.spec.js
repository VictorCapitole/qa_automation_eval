const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';
const PRODUCT_NAME = 'Sauce Labs Backpack';

function productItem(page, productName) {
    return page.getByTestId('inventory-item').filter({ hasText: productName });
}

async function login(page) {
    await page.goto(BASE_URL);

    await page.getByPlaceholder('Username').fill(USERNAME);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
}

async function addProductToCart(page) {
    const product = productItem(page, PRODUCT_NAME);

    await product.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
}

async function removeProductFromCart(page) {
    await page.getByTestId('shopping-cart-link').click();

    const product = productItem(page, PRODUCT_NAME);

    await expect(product).toBeVisible();

    await product.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    await expect(product).toHaveCount(0);
}

async function completeOrder(page) {
    await page.getByTestId('shopping-cart-link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');

    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await expect(productItem(page, PRODUCT_NAME)).toBeVisible();

    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
}

test.describe('Sauce Demo frontend flow', () => {
    test('Req01 - user can login', async ({ page }) => {
        await login(page);
    });

    test('Req02 - user can add a product to the cart', async ({ page }) => {
        await login(page);
        await addProductToCart(page);
    });

    test('Req03 - user can remove a product from the cart', async ({ page }) => {
        await login(page);
        await addProductToCart(page);
        await removeProductFromCart(page);
    });

    test('Req04 - user can complete an order', async ({ page }) => {
        await login(page);
        await addProductToCart(page);
        await completeOrder(page);
    });
});