class DashboardPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.getByTestId('title');
        this.cartLink = page.getByTestId('shopping-cart-link');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
    }

    getCurrentUrl() {
        return this.page.url();
    }

    getPageTitle() {
        return this.pageTitle;
    }

    getCartBadge() {
        return this.cartBadge;
    }

    getProductItem(productName) {
        return this.page.getByTestId('inventory-item').filter({ hasText: productName });
    }

    async addProductToCart(productName) {
        const product = this.getProductItem(productName);
        await product.getByRole('button', { name: 'Add to cart' }).click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    async removeProductFromCart(productName) {
        const product = this.getProductItem(productName);
        await product.getByRole('button', { name: 'Remove' }).click();
    }
}

module.exports = { DashboardPage };
