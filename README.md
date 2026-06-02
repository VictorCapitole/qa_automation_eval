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

Run only the frontend tests:

```bash
npx playwright test --project=chromium
```

Run the frontend tests with the browser visible:

```bash
npx playwright test --project=chromium --headed
```

This headed mode is useful for debugging or visually reviewing the frontend flow. For regular automated execution, use the standard headless commands above.

Run only the API tests:

```bash
npx playwright test --project=api
```

Run the tests in UI mode:

```bash
npx playwright test --ui
```

Show the HTML report after a test run:

```bash
npx playwright show-report
```

## Optional WSL note

If Playwright browser installation fails in WSL or Ubuntu, install Google Chrome locally and run the frontend tests with the local Chrome installation:

```bash
PW_LOCAL_CHROME=1 npx playwright test --project=chromium
```

This is only a local workaround. On macOS or supported Linux versions, use the standard commands above.
