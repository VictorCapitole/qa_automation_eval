import { defineConfig, devices } from '@playwright/test';
import { STORAGE_STATE } from './src/data/testData';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'frontend',
      testDir: './tests/frontend',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        storageState: STORAGE_STATE,
        headless: false,
        launchOptions: { slowMo: 500 },
      },
    },
    {
      name: 'backend',
      testDir: './tests/backend',
      use: {
        baseURL: 'https://pokeapi.co/api/v2/',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
