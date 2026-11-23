import { test, expect } from '@playwright/test';
import fs from 'node:fs';
// FSPEC scenario: One route pass records timing without generating load.
test('single pass captures one route navigation', async ({ page }) => {
  // @step Given a performance check targets the home route
  // @step When the browser performs its single navigation
  const response = await page.goto('/');
  expect(response.status()).toBe(200);
  const nav = await page.evaluate(() => {
    const entry = performance.getEntriesByType('navigation')[0];
    return { domContentLoadedMs: Math.round(entry.domContentLoadedEventEnd), loadMs: Math.round(entry.loadEventEnd), transferBytes: entry.transferSize };
  });
  // @step Then response status and navigation timings are recorded without concurrent or repeated requests
  fs.mkdirSync('test-results', { recursive: true });
  fs.writeFileSync('test-results/performance-observation.json', JSON.stringify({ observationType: 'single-pass, non-load measurement', route: '/', status: response.status(), responseElapsedMs: nav.loadMs, ...nav }, null, 2));
});
