import { test, expect } from '@playwright/test';
// FSPEC scenario: Visitors inspect status, description, and acceptance criteria.
// FSPEC scenario: Visitors can inspect the requirements and check results.
test('requirements page exposes public status, criteria, and GitHub issue', async ({ page }) => {
  // @step Given the public catalog contains a reviewed requirement PORT-002
  // @step When a hiring leader opens the requirements page
  await page.goto('/how-this-should-be-made.html');
  await expect(page.getByRole('heading', { name: 'How this should be made', exact: true })).toBeVisible();
  await expect(page.locator('#PORT-002 .id')).toHaveText('PORT-002');
  await expect(page.locator('#PORT-002 .status')).toBeVisible();
  await expect(page.getByText('Only explicitly public requirements appear here. Internal setup records and raw CI logs remain out of the public catalog.')).toBeVisible();
  // @step Then the page shows PORT-002 status, description, acceptance criteria, and related requirements
  await expect(page.getByRole('link', { name: 'GitHub issue #2', exact: true })).toHaveAttribute('href', 'https://github.com/brandonhoule1/portfolio/issues/2');
  // @step Given the repository contains public PORT requirements and internal foundation work
  // @step When a visitor opens the requirements page
  // FSPEC scenario: Internal work is excluded from the public catalog.
  // @step Then the page lists marked PORT requirements and omits internal foundation work
  await expect(page.getByText('FOUND-001', { exact: true })).toHaveCount(0);
});
// FSPEC scenario: Visitors inspect latest sanitized quality and test results.
test('How this should be made shows the quality evidence and reporting limits', async ({ page }) => {
  // @step Given the latest quality runner has completed
  // @step When a visitor opens the quality evidence page
  await page.goto('/how-this-should-be-made.html#quality-evidence');
  // @step Then the page shows check outcomes and summaries without exposing raw logs or traces
  await expect(page.getByRole('heading', { name: 'What has been checked' })).toBeVisible();
  await expect(page.getByRole('rowheader', { name: 'Single-pass performance' })).toBeVisible();
  await expect(page.getByText(/not load tests or statistical benchmarks/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Security suggestions' })).toBeVisible();
  await expect(page.getByText(/Keep direct and transitive dependencies current/)).toBeVisible();
  await expect(page.locator('#quality-evidence table tbody tr')).toHaveCount(5);
  const statuses = await page.locator('#quality-evidence table tbody tr td:nth-child(2)').allTextContents();
  expect(statuses).toHaveLength(5);
  expect(statuses.every(status => ['passed', 'pending', 'failed'].includes(status.trim()))).toBe(true);
});

test('homepage foregrounds leadership, first 90 days, and case studies', async ({ page }) => {
  // Feature: spec/features/restructure-portfolio-pages-and-correct-the-public-resume.feature
  // @step Given the portfolio homepage is available
  await page.goto('/');
  // @step When a hiring leader reviews the leadership profile
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/AI can take on routine work/);
  // @step Then the homepage shows the concise people-first message, resume CTA, and links to detail pages
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/People need time to think/);
  await expect(page.locator('#home').getByRole('link', { name: 'Download resume' })).toHaveAttribute('href', '/downloads/Brandon-Houle-Resume.pdf');
  await expect(page.getByRole('link', { name: 'View the online resume' })).toHaveAttribute('href', '/resume.html');
  await expect(page.locator('header').getByRole('link', { name: 'First 90 days' })).toHaveAttribute('href', '/first-90-days.html');
  await expect(page.locator('header').getByRole('link', { name: 'Case studies' })).toHaveAttribute('href', '/case-studies.html');
  await expect(page.getByText('Understand the system')).toHaveCount(0);
  await expect(page.getByText('AI-Powered Acquisition Command Center')).toHaveCount(0);
});

test('How this should be made offers a complete downloadable manual test pack', async ({ page }) => {
  // Feature: spec/features/restructure-portfolio-pages-and-correct-the-public-resume.feature
  // @step Given requirements, test evidence, manual cases, and commit history are published
  // @step When a visitor opens How this should be made
  // @step Then all portfolio development material is together there and absent from the homepage
  // @step Given the portfolio has requirements and sanitized check results
  // @step When a visitor opens How this should be made
  // @step Then the requirements grid, quality evidence, and manual test cases appear in one destination
  await page.goto('/how-this-should-be-made.html');
  await expect(page.getByRole('heading', { name: 'How this should be made', exact: true })).toBeVisible();
  await expect(page.locator('#PORT-015')).toBeVisible();
  await expect(page.getByRole('link', { name: /Download manual test cases · Markdown/ })).toHaveAttribute('href', '/manual-test-cases.md');
  await expect(page.getByRole('link', { name: /Download CSV/ })).toHaveAttribute('href', '/manual-test-cases.csv');
  await expect(page.getByRole('heading', { name: 'Development record.' })).toBeVisible();
  // @step Given manual cases cover positive, negative, data, integration, edge, usability, performance, and security paths
  // @step When a visitor selects either test case download
  // @step Then the file contains case identifiers, status, preconditions, steps, and expected results
  for (const category of ['Positive','Negative','Data','Integration','Edge','Usability','Performance','Security']) {
    await expect(page.locator('body')).toContainText(category);
  }
  await expect(page.locator('body')).toContainText('Not run');
  await expect(page.locator('table').last().locator('tbody tr')).toHaveCount(16);
});

test('leadership page preserves the connected LinkedIn portrait and leadership diagram', async ({ page }) => {
  // @step Given the connected LinkedIn profile photo is included in the site build
  // @step When a visitor opens the homepage
  await page.goto('/leadership.html');
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
  await expect(page.locator('header .brand-name')).toHaveText('Brandon Houle');
  await expect(page.locator('header .brand-role')).toHaveText('Technology Leader / Innovator');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('think');
  await expect(page.locator('header').getByRole('link', { name: 'First 90 days' })).toHaveAttribute('href', '/first-90-days.html');
  await expect(page.locator('header').getByRole('link', { name: 'Case studies' })).toHaveAttribute('href', '/case-studies.html');
  await expect(page.locator('header').getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog/');
  await expect(page.locator('header').getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact/');
  await expect(page.locator('header').getByRole('link', { name: 'Field Notes' })).toHaveCount(0);
  await expect(page.locator('.case-study')).toHaveCount(0);
  await expect(page.locator('header').getByRole('link', { name: 'Resume' })).toHaveAttribute('href', '/resume.html');
});

test('How this should be made retains requirements, quality, manual cases, and development record', async ({ page }) => {
  // @step Given the portfolio has public requirements, quality evidence, and manual cases
  // @step When a visitor opens How this should be made
  await page.goto('/how-this-should-be-made.html');
  // @step Then the requirements grid, quality evidence, and manual case downloads remain available
  await expect(page.locator('header .brand-name')).toHaveText('Brandon Houle');
  await expect(page.locator('header .brand-role')).toHaveText('Technology Leader / Innovator');
  await expect(page.locator('.grid[aria-label="Public requirements"] .card')).toHaveCount(19);
  await expect(page.getByRole('heading', { name: /What has been checked/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Download manual test cases/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Download CSV/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Development record.' })).toBeVisible();
});

test('editorial logbook profile shows the requested identity and contact details', async ({ page }) => {
  // @step Given the public profile identifies its subject and contact details
  // @step When a hiring leader opens the homepage
  await page.goto('/');
  // @step Then Brandon's two-line role mark, website, and contact form are visible
  await expect(page.locator('header .brand-name')).toHaveText('Brandon Houle');
  await expect(page.locator('header .brand-role')).toHaveText('Technology Leader / Innovator');
  await expect(page.getByRole('link', { name: 'brandonhoule.com' })).toHaveAttribute('href', 'https://brandonhoule.com');
  await expect(page.locator('.site-footer').getByRole('link', { name: 'Contact form' })).toHaveAttribute('href', '/contact/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://brandonhoule.com/');
  await expect(page.locator('.case-study')).toHaveCount(0);
  await expect(page.locator('.note-entry')).toHaveCount(0);
  await expect(page.locator('.profile-portrait img')).toBeVisible();
});

test('editorial styling uses display typography and unboxed case notes', async ({ page }) => {
  // @step Given the homepage uses text-led career content and the selected editorial direction
  // @step When a visitor reads the profile and case notes
  await page.goto('/#case-studies');
  // @step Then display typography, fine rules, and unboxed case studies define the visual hierarchy
  const headingFont = await page.locator('h1').first().evaluate(el => getComputedStyle(el).fontFamily);
  expect(headingFont).toContain('Georgia');
  await page.goto('/case-studies.html');
  await expect(page.locator('.case-study')).toHaveCount(3);
  await expect(page.locator('.case-study').first()).toHaveCSS('border-radius', '0px');
  await expect(page.locator('.case-study').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.case-study').first()).toHaveCSS('border-bottom-style', 'solid');
});

test('case studies and an empty blog have separate pages', async ({ page }) => {
  // Feature: spec/features/restructure-portfolio-pages-and-correct-the-public-resume.feature
  // @step Given the site navigation is available
  await page.goto('/case-studies.html');
  // @step When a hiring leader opens case studies and the blog index
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://brandonhoule.com/case-studies.html');
  await expect(page.locator('.case-study')).toHaveCount(3);
  await page.goto('/blog/');
  // @step Then the blog index has its own canonical URL and no unpublished sample posts
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://brandonhoule.com/blog/');
  await expect(page.getByText('No articles published yet.')).toBeVisible();
  await expect(page.locator('.blog-entry')).toHaveCount(0);
  await page.goto('/resume.html');
  await expect(page.locator('.resume-contact').getByRole('link', { name: 'Contact form' })).toHaveAttribute('href', '/contact/');
  await expect(page.locator('.resume-contact').getByRole('link', { name: 'brandonhoule.com' })).toHaveAttribute('href', 'https://brandonhoule.com');
  await expect(page.locator('.resume-contact').getByRole('link', { name: 'linkedin.com/in/brandon-houle' })).toHaveAttribute('href', 'https://www.linkedin.com/in/brandon-houle');
  await expect(page.getByRole('heading', { name: /Manager, Applied Automation and AgentOps/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download resume PDF' })).toHaveAttribute('href', '/downloads/Brandon-Houle-Resume.pdf');
});

test('leadership page presents the governance starter kit and broader models', async ({ page }) => {
  // Feature: spec/features/leadership-first-portfolio.feature
  // @step Given the Leadership page presents a public governance starter kit
  await page.goto('/leadership.html');
  // @step When a hiring leader reads Brandon's broader leadership models
  await expect(page.getByRole('heading', { name: /Make responsibility clear before AI changes the work/ })).toBeVisible();
  await expect(page.locator('.governance-stage')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: /OTHER LEADERSHIP MODELS|Ways I frame the work/ })).toBeVisible();
  // @step Then the page describes those models as judgment lenses without publishing step-by-step procedures
  await expect(page.getByRole('heading', { name: 'Business-first opportunity model' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Human–AI work design' })).toBeVisible();
  await expect(page.locator('.model-list details')).toHaveCount(0);
});

test('resume page displays the corrected public contact details', async ({ page }) => {
  await page.goto('/resume.html');
  const contact = page.locator('.resume-contact');
  await expect(contact).not.toContainText('candidatesnet.com');
  await expect(contact).toContainText('Contact form');
  await expect(contact).toContainText('brandonhoule.com');
  await expect(contact).toContainText('linkedin.com/in/brandon-houle');
});

test('footer gives direct access to profile, writing, contact, and build notes', async ({ page }) => {
  // Feature: spec/features/restructure-portfolio-pages-and-correct-the-public-resume.feature
  // @step Given a visitor has reached the end of any portfolio page
  await page.goto('/');
  const footer = page.locator('.site-footer');
  await expect(footer).toBeVisible();
  // @step When the visitor scans the site footer
  // @step Then the footer offers useful links to the resume, LinkedIn, contact form, portfolio sections, and development record
  await expect(footer.getByRole('link', { name: 'Online resume' })).toHaveAttribute('href', '/resume.html');
  await expect(footer.getByRole('link', { name: 'Download resume' })).toHaveAttribute('href', '/downloads/Brandon-Houle-Resume.pdf');
  await expect(footer.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/brandon-houle');
  await expect(footer.getByRole('link', { name: 'Development record' })).toHaveAttribute('href', '/how-this-should-be-made.html');
  await expect(footer.getByRole('link', { name: 'Contact form' })).toHaveAttribute('href', '/contact/');
  await expect(footer.getByRole('link', { name: 'Field Notes' })).toHaveCount(0);
  await expect(footer.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog/');
});

test('development record lists every available revision with exact GitHub links', async ({ page }) => {
  // @step Given the build has access to the checked-out repository history
  // @step When a visitor opens the development record
  await page.goto('/how-this-should-be-made.html#commits');
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
