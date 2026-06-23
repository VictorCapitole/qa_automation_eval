class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.getByTestId('error');
    }

    async navigateTo(baseUrl) {
        await this.page.goto(baseUrl);
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    getErrorMessage() {
        return this.errorMessage;
    }
}

module.exports = { LoginPage };
