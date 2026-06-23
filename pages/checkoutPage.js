class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.pageTitle = page.getByTestId('title');
        this.errorMessage = page.getByTestId('error');
        this.paymentInformation = page.getByTestId('payment-info-value');
        this.shippingInformation = page.getByTestId('shipping-info-value');
        this.totalInformation = page.getByTestId('total-label');
    }

    getPageTitle() {
        return this.pageTitle;
    }

    getErrorMessage() {
        return this.errorMessage;
    }

    getPaymentInformation() {
        return this.paymentInformation;
    }

    getShippingInformation() {
        return this.shippingInformation;
    }

    getTotalInformation() {
        return this.totalInformation;
    }

    getProductItem(productName) {
        return this.page.getByTestId('inventory-item').filter({ hasText: productName });
    }

    async startCheckout() {
        await this.checkoutButton.click();
    }

    async fillCustomerInformation(customer) {
        await this.firstNameInput.fill(customer.firstName);
        await this.lastNameInput.fill(customer.lastName);
        await this.postalCodeInput.fill(customer.postalCode);
    }

    async continueCheckout() {
        await this.continueButton.click();
    }

    async finishOrder() {
        await this.finishButton.click();
    }
}

module.exports = { CheckoutPage };
