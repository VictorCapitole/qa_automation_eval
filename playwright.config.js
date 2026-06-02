import { defineConfig, devices } from '@playwright/test';

const useLocalChrome = process.env.PW_LOCAL_CHROME === '1';

export default defineConfig({
  testDir: './tests',

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(useLocalChrome ? { channel: 'chrome' } : {}),
      },
    },
  ],
});