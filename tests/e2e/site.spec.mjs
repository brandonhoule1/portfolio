import { test, expect } from '@playwright/test';
// FSPEC scenario: Visitors inspect status, description, and acceptance criteria.
// FSPEC scenario: Visitors can inspect the requirements and check results.
test('requirements page exposes public status, criteria, and GitHub issue', async ({ page }) => {
  // @step Given the public catalog contains a reviewed requirement PORT-002
  // @step When a hiring leader opens the requirements page
  await page.goto('/requirements.html');
  await expect(page.getByRole('heading', { name: 'Requirements', exact: true })).toBeVisible();
  await expect(page.locator('#PORT-002 .id')).toHaveText('PORT-002');
  await expect(page.locator('#PORT-002 .status')).toBeVisible();
  await expect(page.getByText('Internal foundation and setup records are omitted.')).toBeVisible();
  // @step Then the page shows PORT-002 status, description, acceptance criteria, and related requirements
  await expect(page.getByRole('link', { name: 'GitHub issue #2' })).toHaveAttribute('href', 'https://github.com/brandonhoule1/portfolio/issues/2');
  // @step Given the repository contains public PORT requirements and internal foundation work
  // @step When a visitor opens the requirements page
  // FSPEC scenario: Internal work is excluded from the public catalog.
  // @step Then the page lists marked PORT requirements and omits internal foundation work
  await expect(page.getByText('FOUND-001', { exact: true })).toHaveCount(0);
});
// FSPEC scenario: Visitors inspect latest sanitized quality and test results.
test('quality evidence page states the reporting limits', async ({ page }) => {
  // @step Given the latest quality runner has completed
  // @step When a visitor opens the quality evidence page
  await page.goto('/evidence.html');
  // @step Then the page shows check outcomes and summaries without exposing raw logs or traces
  await expect(page.getByRole('heading', { name: 'Quality evidence' })).toBeVisible();
  await expect(page.getByRole('rowheader', { name: 'Single-pass performance' })).toBeVisible();
  await expect(page.getByText(/not load tests or statistical benchmarks/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Security suggestions' })).toBeVisible();
  await expect(page.getByText(/Keep direct and transitive dependencies current/)).toBeVisible();
  await expect(page.locator('table tbody tr')).toHaveCount(5);
  await expect(page.locator('table tbody .pill')).toHaveCount(5);
});
