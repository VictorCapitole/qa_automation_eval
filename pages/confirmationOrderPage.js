class ConfirmationOrderPage {
    constructor(page) {
        this.completeHeader = page.getByTestId('complete-header');
    }

    getCompleteHeader() {
        return this.completeHeader;
    }
}

module.exports = { ConfirmationOrderPage };
