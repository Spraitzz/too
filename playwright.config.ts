import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  projects: [
    {
      name: 'api',
      use: {
        baseURL: 'http://localhost:3000',
      },
    },
  ],
});