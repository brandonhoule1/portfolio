import { test, expect } from '@playwright/test';

test('independent studies are available from shared navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Independent studies' }).click();
  await expect(page).toHaveURL(/\/independent\/$/);
});

// Feature: spec/features/independent-ai-exploration.feature
// @step Given the visitor opens the Independent Studies page
// @step When they read the project introduction
// @step Then the page states the question about checking AI answers against sources
// @step And the work is described as independent public-source study
// @step And no employer or workplace example is included
test('the independent project states a personal research question', async ({ page }) => {
  await page.goto('/independent/');
  await expect(page.getByRole('heading', { name: 'Can an AI answer survive a source check?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My question' })).toBeVisible();
  await expect(page.getByText(/No employer, client, workplace, or internal information is used/)).toBeVisible();
});

test('public company analysis separates company disclosures from interpretation', async ({ page }) => {
  // @step Given the visitor opens the Independent Studies page
  await page.goto('/independent/');
  // @step When they read the Duolingo analysis
  await expect(page.getByRole('heading', { name: /What Duolingo’s public reporting says about AI speaking practice/ })).toBeVisible();
  // @step Then the analysis states its review date and links to primary sources
  await expect(page.getByText('As of November 24, 2026')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Q3 2026 shareholder letter (SEC)' })).toHaveAttribute('href', 'https://www.sec.gov/Archives/edgar/data/1562088/000162828026069474/q3fy26duolingo9-30x26share.htm');
  // @step And reported facts are separated from interpretation and attributed to the source
  await expect(page.getByRole('heading', { name: 'What the company reported' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What this suggests — and what remains unknown' })).toBeVisible();
  // @step And forward-looking statements are labeled as company guidance, not outcomes
  await expect(page.getByText(/management guidance, not a reported result/i)).toBeVisible();
});

test('independent samples state their scope and provide a reusable source template', async ({ page }) => {
  // @step Given the visitor opens the independent case study and sample artifact
  await page.goto('/independent/');
  // @step When they inspect the case study, evaluation method, and source-review template
  await expect(page.getByRole('heading', { name: 'How the brief was assembled' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Judge the answer against a manual reference' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download the source-review template' })).toBeVisible();
  // @step Then the material is identified as a public-source portfolio exercise prepared with AI assistance
  await expect(page.getByText(/This independent portfolio exercise was prepared with AI assistance/i)).toBeVisible();
  // @step And no employer, client, workplace, internal data, or measured business outcome is claimed
  await expect(page.getByText(/No employer, client, workplace, or internal information is used/i)).toBeVisible();
  await expect(page.getByText(/No product deployment or measured learning outcome is claimed/i)).toBeVisible();
  // @step And the visitor can download the reusable source-review template
  const response = await page.request.get('/downloads/source-review-brief-template.md');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain('## Directly supported facts');
});

test('the 90-day plan is a proposed personal learning plan', async ({ page }) => {
  // @step Given the visitor opens the proposed 90-day plan
  await page.goto('/independent/#personal-plan');
  // @step When they review the three stages
  await expect(page.locator('#personal-plan .plan-stage')).toHaveCount(3);
  // @step Then each stage focuses on personal research, a small prototype, and evaluation
  await expect(page.locator('#personal-plan')).toContainText(/one public question/i);
  await expect(page.locator('#personal-plan')).toContainText(/source-checking research notebook/i);
  await expect(page.locator('#personal-plan')).toContainText(/compare/i);
  // @step And the page makes clear that the plan is proposed and is not an employer onboarding plan
  await expect(page.locator('#personal-plan')).toContainText(/proposed personal project/i);
  await expect(page.locator('#personal-plan')).toContainText(/not an employer onboarding plan/i);
});

