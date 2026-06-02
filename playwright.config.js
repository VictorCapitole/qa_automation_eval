import { defineConfig, devices } from '@playwright/test';

const useLocalChrome = process.env.PW_LOCAL_CHROME === '1';

export default defineConfig({
  testDir: './tests',

  use: {
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'chromium',
      testMatch: '**/processOrder.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        ...(useLocalChrome ? { channel: 'chrome' } : {}),
      },
    },
    {
      name: 'api',
      testMatch: '**/testAPI.spec.js',
    },
  ]
});