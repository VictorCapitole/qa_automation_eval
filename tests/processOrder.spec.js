const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';
const PRODUCT_NAME = 'Sauce Labs Backpack';

const CUSTOMER = {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
};

function productItem(page, productName) {
    return page.getByTestId('inventory-item').filter({ hasText: productName });
}

async function login(page) {
    await page.goto(BASE_URL);

    const usernameInput = page.getByPlaceholder('Username');
    const passwordInput = page.getByPlaceholder('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill(USERNAME);
    await passwordInput.fill(PASSWORD);
    await loginButton.click();
}

async function validateUserIsLoggedIn(page) {
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
}

async function addProductToCart(page, productName = PRODUCT_NAME) {
    const product = productItem(page, productName);
    const addToCartButton = product.getByRole('button', { name: 'Add to cart' });

    await addToCartButton.click();
}

async function validateProductWasAddedToCart(page, productName = PRODUCT_NAME) {
    const cartBadge = page.getByTestId('shopping-cart-badge');

    await expect(cartBadge).toHaveText('1');

    await page.getByTestId('shopping-cart-link').click();

    await expect(productItem(page, productName)).toBeVisible();
}

async function removeProductFromCart(page, productName = PRODUCT_NAME) {
    await page.getByTestId('shopping-cart-link').click();

    const product = productItem(page, productName);
    const removeButton = product.getByRole('button', { name: 'Remove' });

    await expect(product).toBeVisible();

    await removeButton.click();
}

async function validateProductWasRemovedFromCart(page, productName = PRODUCT_NAME) {
    const product = productItem(page, productName);
    const cartBadge = page.getByTestId('shopping-cart-badge');

    await expect(cartBadge).toHaveCount(0);
    await expect(product).toHaveCount(0);
}

async function completeOrder(page) {
    await page.getByTestId('shopping-cart-link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    const firstNameInput = page.getByPlaceholder('First Name');
    const lastNameInput = page.getByPlaceholder('Last Name');
    const postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    const continueButton = page.getByRole('button', { name: 'Continue' });

    await firstNameInput.fill(CUSTOMER.firstName);
    await lastNameInput.fill(CUSTOMER.lastName);
    await postalCodeInput.fill(CUSTOMER.postalCode);
    await continueButton.click();

    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await expect(productItem(page, PRODUCT_NAME)).toBeVisible();

    await page.getByRole('button', { name: 'Finish' }).click();
}

async function validateOrderWasCompleted(page) {
    await expect(
        page.getByRole('heading', { name: 'Thank you for your order!' })
    ).toBeVisible();
}

test.describe('Sauce Demo frontend flow', () => {
    test('Req01 - user can login', async ({ page }) => {
        await login(page);
        await validateUserIsLoggedIn(page);
    });

    test('Req02 - user can add a product to the cart', async ({ page }) => {
        await login(page);
        await validateUserIsLoggedIn(page);

        await addProductToCart(page);
        await validateProductWasAddedToCart(page);
    });

    test('Req03 - user can remove a product from the cart', async ({ page }) => {
        await login(page);
        await validateUserIsLoggedIn(page);

        await addProductToCart(page);
        await removeProductFromCart(page);
        await validateProductWasRemovedFromCart(page);
    });

    test('Req04 - user can complete an order', async ({ page }) => {
        await login(page);
        await validateUserIsLoggedIn(page);

        await addProductToCart(page);
        await completeOrder(page);
        await validateOrderWasCompleted(page);
    });
});