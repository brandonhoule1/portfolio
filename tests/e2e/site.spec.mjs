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
  await expect(page.getByRole('heading', { name: /Engineering, quality, performance, and AI/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Download AI Enablement base resume/ })).toHaveAttribute('href', '/downloads/Brandon-Houle-AI-Enablement-Resume.pdf');
  await expect(page.getByRole('heading', { name: /First 90 days/ })).toBeVisible();
  await expect(page.getByText(/illustrative, organization-adaptable plan/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Executive' })).toHaveAttribute('href', '#showcase');
  await expect(page.getByText('CAREER RECORD', { exact: true })).toBeVisible();
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

test('homepage uses the connected LinkedIn portrait beside the leadership diagram', async ({ page }) => {
  // @step Given the connected LinkedIn profile photo is included in the site build
  // @step When a visitor opens the homepage
  await page.goto('/');
  // @step Then Brandon's portrait has meaningful alternative text and the original leadership diagram remains visible
  const portrait = page.locator('#linkedin-portrait');
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute('alt', "Brandon Houle, technology and AI enablement leader");
  await expect(page.locator('.hero-art .core')).toBeVisible();
});

test('professional wordmark and restrained design retain all portfolio content', async ({ page }) => {
  // @step Given the portfolio has the established resume, leadership, and career content
  // @step When a recruiter opens the homepage
  await page.goto('/');
  // @step Then the wordmark identifies Brandon Houle as a Technology Leader and the existing sections remain available
  await expect(page.locator('.brand-name')).toHaveText('Brandon Houle');
  await expect(page.locator('.brand-role')).toHaveText('Technology Leader / Innovator');
  await expect(page.getByRole('heading', { name: /Engineering, quality, performance, and AI/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /First 90 days/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Selected responsibilities across the engineering lifecycle/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Frameworks, examples, and decision notes/ })).toBeVisible();
  await expect(page.locator('.showcase-grid details')).toHaveCount(6);
});

test('restyled How this was made page retains requirements and quality material', async ({ page }) => {
  // @step Given the portfolio has public requirements, quality evidence, and manual cases
  // @step When a visitor opens How this was made
  await page.goto('/how-this-was-made.html');
  // @step Then the requirements grid, quality evidence, and manual case downloads remain available
  await expect(page.locator('.brand-name')).toHaveText('Brandon Houle');
  await expect(page.locator('.brand-role')).toHaveText('Technology Leader / Innovator');
  await expect(page.locator('.grid[aria-label="Public requirements"] .card')).toHaveCount(18);
  await expect(page.getByRole('heading', { name: /What has been checked/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Download manual test cases/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Download CSV/ })).toBeVisible();
});

test('editorial logbook profile shows the requested identity and contact details', async ({ page }) => {
  // @step Given the public profile identifies its subject and contact details
  // @step When a hiring leader opens the homepage
  await page.goto('/');
  // @step Then Brandon's two-line role mark, website, and email are visible
  await expect(page.locator('.brand-name')).toHaveText('Brandon Houle');
  await expect(page.locator('.brand-role')).toHaveText('Technology Leader / Innovator');
  await expect(page.getByRole('link', { name: 'brandonhoule.com' })).toHaveAttribute('href', 'https://brandonhoule.com');
  await expect(page.locator('aside.contact-line').getByRole('link', { name: 'brandonhoule@gmail.com' })).toHaveAttribute('href', 'mailto:brandonhoule@gmail.com');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://brandonhoule.com/');
  await expect(page.locator('.case-entry')).toHaveCount(3);
  await expect(page.locator('.note-entry')).toHaveCount(3);
  await expect(page.locator('.hero-art .core')).toBeVisible();
});

test('editorial styling uses display typography and unboxed case notes', async ({ page }) => {
  // @step Given the homepage uses text-led career content and the selected editorial direction
  // @step When a visitor reads the profile and case notes
  await page.goto('/#case-studies');
  // @step Then display typography, fine rules, and unboxed case studies define the visual hierarchy
  const headingFont = await page.locator('h1').first().evaluate(el => getComputedStyle(el).fontFamily);
  expect(headingFont).toContain('Georgia');
  await expect(page.locator('.case-entry').first()).toHaveCSS('border-radius', '0px');
  await expect(page.locator('.case-entry').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.case-entry').first()).toHaveCSS('border-top-style', 'solid');
});

test('career notes and field notes preserve evidence boundaries and structured article data', async ({ page }) => {
  // @step Given the portfolio includes only resume-grounded career evidence
  // @step When a visitor reads the case studies and field notes
  await page.goto('/#case-studies');
  // @step Then three case notes and dated, authored articles distinguish evidence from perspective
  await expect(page.locator('.case-entry')).toHaveCount(3);
  await expect(page.getByText(/No adoption, productivity, or quality result is claimed/)).toBeVisible();
  await expect(page.locator('.note-entry[itemtype="https://schema.org/BlogPosting"]')).toHaveCount(3);
  await expect(page.locator('.note-entry meta[itemprop="author"]')).toHaveCount(3);
  await expect(page.locator('.note-entry time[datetime="2026-11-23"]')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Working notes on technology and delivery.' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(mobile).toBe(true);
});

test('development record lists every available revision with exact GitHub links', async ({ page }) => {
  // @step Given the build has access to the checked-out repository history
  // @step When a visitor opens the development record
  await page.goto('/#commits');
  // @step Then every available commit shows its date, subject, and exact GitHub revision link
  const commits = await page.evaluate(async () => (await fetch('/commits.json')).json());
  const rows = page.locator('#commit-list li');
  await expect(rows).toHaveCount(commits.length);
  expect(commits.length).toBeGreaterThan(0);
  for (const [index, commit] of commits.entries()) {
    const row = rows.nth(index);
    await expect(row.locator('time')).toHaveAttribute('datetime', commit.date);
    await expect(row.locator('a')).toHaveAttribute('href', `https://github.com/brandonhoule1/portfolio/commit/${commit.sha}`);
    await expect(row.locator('code')).toHaveText(commit.shortSha);
  }
  await expect(page.locator('body')).not.toContainText('73150451+brandonhoule1@users.noreply.github.com');
});
