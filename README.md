# qa_automation_eval

Develop the following automated tests in Playwright Framework.
Keep tests focused on a single goal and reduce setup steps to the bare minimum.

FRONTEND - Create the tests you see necessary to cover the following requirements:

Req01: As a User I want to be able to Login into https://www.saucedemo.com/
Req02: As a User I want to be able to add a product to the cart
Req03: As a User I want to be able to remove a product from the cart
Req04: As a User I want to be able to complete an order

BACKEND - Automate the following scenario with the number of tests you see fit:
API: https://pokeapi.co/

Scenario: 
Pikachu has two abilities.
Each Ability has a name with an associated url with expanded info on the ability,is hidden or not and it has an associated slot.
One of its abilites is shared amongst more Pokemon than the other.
Pikachu have over a 100 moves.
Pikachu shares more than 10 moves with Electabuzz.

## How to run the tests

Install the project dependencies:

```bash
npm install
```

Install the Playwright browsers:

```bash
npx playwright install
```

Run all tests:

```bash
npx playwright test
```

Run the tests in UI mode:

```bash
npx playwright test --ui
```

Show the HTML report after a test run:

```bash
npx playwright show-report
```

## Local WSL / Ubuntu workaround

On some WSL or Ubuntu versions, Playwright may fail when downloading its bundled Chromium browser. In that case, install Google Chrome inside WSL and run the tests using the local Chrome installation.

Install Google Chrome:

```bash
sudo apt update
sudo apt install -y google-chrome-stable
```

If the package is not available, add Google's repository first:

```bash
sudo apt update
sudo apt install -y wget gnupg ca-certificates
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-linux.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install -y google-chrome-stable
```

Verify Chrome is installed:

```bash
google-chrome --version
```

Run the tests with local Chrome:

```bash
PW_LOCAL_CHROME=1 npx playwright test
```

This workaround is only needed for local execution in WSL/Ubuntu environments where Playwright browser installation is not supported. On macOS or supported Linux versions, use the standard commands above.
