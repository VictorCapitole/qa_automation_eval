const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { DashboardPage } = require('../pages/dashboardPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const { ConfirmationOrderPage } = require('../pages/confirmationOrderPage');
const { orderData } = require('../data/orderData');

test.describe('Sauce Demo frontend flow', () => {
    let loginPage;
    let dashboardPage;
    let checkoutPage;
    let confirmationOrderPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        checkoutPage = new CheckoutPage(page);
        confirmationOrderPage = new ConfirmationOrderPage(page);

        await loginPage.navigateTo(orderData.baseUrl);
    });

    async function loginAsStandardUser() {
        await loginPage.login(
            orderData.users.standard.username,
            orderData.users.standard.password
        );
    }

    async function addBackpackAndStartCheckout() {
        await dashboardPage.addProductToCart(orderData.products.backpack);
        await dashboardPage.openCart();
        await checkoutPage.startCheckout();
    }

    async function continueCheckoutWithCustomer(customer) {
        await checkoutPage.fillCustomerInformation(customer);
        await checkoutPage.continueCheckout();
    }

    async function expectUserIsOnDashboard() {
        expect(dashboardPage.getCurrentUrl()).toContain('/inventory');
        await expect(dashboardPage.getPageTitle()).toHaveText('Products');
    }

    async function expectCheckoutOverviewIsVisible() {
        await expect(checkoutPage.getPageTitle()).toHaveText('Checkout: Overview');
        await expect(checkoutPage.getProductItem(orderData.products.backpack)).toBeVisible();
        await expect(checkoutPage.getPaymentInformation()).toBeVisible();
        await expect(checkoutPage.getShippingInformation()).toBeVisible();
        await expect(checkoutPage.getTotalInformation()).toContainText('Total:');
    }

    test('Req01 - user can login', async () => {
        await loginAsStandardUser();

        await expectUserIsOnDashboard();
    });

    test('Req02 - user can add a product to the cart', async () => {
        await loginAsStandardUser();

        await expectUserIsOnDashboard();
        await dashboardPage.addProductToCart(orderData.products.backpack);

        await expect(dashboardPage.getCartBadge()).toHaveText('1');

        await dashboardPage.openCart();
        await expect(dashboardPage.getProductItem(orderData.products.backpack)).toBeVisible();
    });

    test('Req03 - user can remove a product from the cart', async () => {
        await loginAsStandardUser();

        await expectUserIsOnDashboard();
        await dashboardPage.addProductToCart(orderData.products.backpack);
        await dashboardPage.openCart();
        await expect(dashboardPage.getProductItem(orderData.products.backpack)).toBeVisible();

        await dashboardPage.removeProductFromCart(orderData.products.backpack);

        await expect(dashboardPage.getCartBadge()).toHaveCount(0);
        await expect(dashboardPage.getProductItem(orderData.products.backpack)).toHaveCount(0);
    });

    test('Req04 - user can complete an order', async () => {
        await loginAsStandardUser();

        await expectUserIsOnDashboard();
        await addBackpackAndStartCheckout();
        await continueCheckoutWithCustomer(orderData.customers.valid);
        await expectCheckoutOverviewIsVisible();
        await checkoutPage.finishOrder();

        await expect(confirmationOrderPage.getCompleteHeader()).toHaveText(orderData.messages.orderCompleted);
    });

    test('Negative - user cannot login with empty username', async () => {
        await loginPage.login(
            orderData.users.emptyUsername.username,
            orderData.users.emptyUsername.password
        );

        await expect(loginPage.getErrorMessage()).toContainText(orderData.messages.usernameRequired);
    });

    test('Negative - user cannot login with empty password', async () => {
        await loginPage.login(
            orderData.users.emptyPassword.username,
            orderData.users.emptyPassword.password
        );

        await expect(loginPage.getErrorMessage()).toContainText(orderData.messages.passwordRequired);
    });

    test('Negative - user cannot login with invalid credentials', async () => {
        await loginPage.login(
            orderData.users.invalid.username,
            orderData.users.invalid.password
        );

        await expect(loginPage.getErrorMessage()).toContainText(orderData.messages.invalidCredentials);
    });

    test('Negative - locked out user cannot login', async () => {
        await loginPage.login(
            orderData.users.lockedOut.username,
            orderData.users.lockedOut.password
        );

        await expect(loginPage.getErrorMessage()).toContainText(orderData.messages.lockedOutUser);
    });

    test('Negative - user cannot continue checkout without first name', async () => {
        await loginAsStandardUser();

        await addBackpackAndStartCheckout();
        await continueCheckoutWithCustomer(orderData.customers.missingFirstName);

        await expect(checkoutPage.getErrorMessage()).toContainText(orderData.messages.firstNameRequired);
    });

    test('Negative - user cannot continue checkout without last name', async () => {
        await loginAsStandardUser();

        await addBackpackAndStartCheckout();
        await continueCheckoutWithCustomer(orderData.customers.missingLastName);

        await expect(checkoutPage.getErrorMessage()).toContainText(orderData.messages.lastNameRequired);
    });

    test('Negative - user cannot continue checkout without postal code', async () => {
        await loginAsStandardUser();

        await addBackpackAndStartCheckout();
        await continueCheckoutWithCustomer(orderData.customers.missingPostalCode);

        await expect(checkoutPage.getErrorMessage()).toContainText(orderData.messages.postalCodeRequired);
    });

    test('Edge - checkout handles input string injection safely', async () => {
        await loginAsStandardUser();

        await addBackpackAndStartCheckout();
        await continueCheckoutWithCustomer(orderData.customers.injectionPayload);

        await expectCheckoutOverviewIsVisible();
    });

    test('Boundary - checkout handles 250 plus character first and last names', async () => {
        await loginAsStandardUser();

        await addBackpackAndStartCheckout();
        await continueCheckoutWithCustomer(orderData.customers.boundaryLength);

        await expectCheckoutOverviewIsVisible();
    });

    test('Boundary - checkout handles invalid postal code format', async () => {
        await loginAsStandardUser();

        await addBackpackAndStartCheckout();
        await continueCheckoutWithCustomer(orderData.customers.invalidPostalCode);

        await expectCheckoutOverviewIsVisible();
    });
});
