import { defineConfig, devices } from '@playwright/test';
const port = Number(process.env.PORT ?? 4173);
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.mjs',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  outputDir: 'test-results/e2e',
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'node scripts/serve.mjs', port, reuseExistingServer: !process.env.CI, timeout: 15000 }
});
