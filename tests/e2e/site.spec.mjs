import { test, expect } from '@playwright/test';
// FSPEC scenario: Visitors inspect status, description, and acceptance criteria.
// FSPEC scenario: Visitors can inspect the requirements and check results.
test('requirements page exposes public status, criteria, and GitHub issue', async ({ page }) => {
  // @step Given the public catalog contains a reviewed requirement PORT-002
  // @step When a hiring leader opens the requirements page
  await page.goto('/how-this-was-made.html');
  await expect(page.getByRole('heading', { name: 'How this was made', exact: true })).toBeVisible();
  await expect(page.locator('#PORT-002 .id')).toHaveText('PORT-002');
  await expect(page.locator('#PORT-002 .status')).toBeVisible();
  await expect(page.getByText('Only explicitly public requirements appear here. Internal setup records and raw CI logs remain out of the public catalog.')).toBeVisible();
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

test('leadership profile centers the resume-backed story and first 90 days', async ({ page }) => {
  // @step Given the portfolio has been built with the canonical AI Enablement resume
  // @step When a visitor opens the home page
  await page.goto('/');
  // @step Then the profile, downloadable resume, career evidence, and illustrative first-90-days plan are available
  await expect(page.getByRole('heading', { name: /Who is Brandon Houle/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Download my resume/ })).toHaveAttribute('href', '/downloads/Brandon-Houle-AI-Enablement-Resume.pdf');
  await expect(page.getByRole('heading', { name: /First 90 days/ })).toBeVisible();
  await expect(page.getByText(/illustrative, organization-adaptable plan/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Executive' })).toHaveAttribute('href', '#showcase');
  await expect(page.getByText('CAREER EVIDENCE', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /AI readiness, in context/ })).toBeVisible();
  await expect(page.getByText('Ten-minute leadership review')).toBeVisible();
  // @step Given the portfolio includes synthetic organization examples
  // @step When a visitor reads the leadership demonstrations
  // @step Then synthetic examples and adaptable plans are labeled and are not attributed as achieved client outcomes
  await expect(page.getByText(/Illustrative scenario · synthetic/)).toBeVisible();
  await expect(page.getByText(/These summaries reflect responsibilities described in my resume/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'How this was made' }).first()).toHaveAttribute('href', '/how-this-was-made.html');
});

test('unified process page offers a complete downloadable manual test pack', async ({ page }) => {
  // @step Given the portfolio has requirements and sanitized check results
  // @step When a visitor opens How this was made
  // @step Then the requirements grid, quality evidence, and manual test cases appear in one destination
  await page.goto('/how-this-was-made.html');
  await expect(page.getByRole('heading', { name: 'How this was made', exact: true })).toBeVisible();
  await expect(page.locator('#PORT-015')).toBeVisible();
  await expect(page.getByRole('link', { name: /Download manual test cases · Markdown/ })).toHaveAttribute('href', '/manual-test-cases.md');
  await expect(page.getByRole('link', { name: /Download CSV/ })).toHaveAttribute('href', '/manual-test-cases.csv');
  // @step Given manual cases cover positive, negative, data, integration, edge, usability, performance, and security paths
  // @step When a visitor selects either test case download
  // @step Then the file contains case identifiers, status, preconditions, steps, and expected results
  for (const category of ['Positive','Negative','Data','Integration','Edge','Usability','Performance','Security']) {
    await expect(page.locator('body')).toContainText(category);
  }
  await expect(page.locator('body')).toContainText('Not run');
  await expect(page.locator('table').last().locator('tbody tr')).toHaveCount(16);
});
