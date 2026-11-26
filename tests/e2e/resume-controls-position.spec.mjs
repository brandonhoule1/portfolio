import { test, expect } from '@playwright/test';

test('resume detail controls appear before the resume content', async ({ page }) => {
  // Feature: spec/features/resume-top-level-expand-collapse-control.feature
  // @step Given the online resume is open
  await page.goto('/resume.html');
  const controls = page.getByRole('navigation', { name: 'Resume detail controls' });
  await expect(controls).toBeVisible();
  // @step Then the Expand all and Collapse all controls appear before the resume heading
  await expect(controls).toHaveJSProperty('previousElementSibling', null);
  expect(await controls.evaluate(element => element.compareDocumentPosition(document.querySelector('.resume-heading')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();

  const disclosures = page.locator('.resume-page details.resume-detail');
  await expect(disclosures).toHaveCount(9);
  // @step And the detail sections start collapsed
  await expect(page.locator('.resume-page details.resume-detail[open]')).toHaveCount(0);
});

test('resume detail controls expand and collapse every disclosure', async ({ page }) => {
  // Feature: spec/features/resume-top-level-expand-collapse-control.feature
  // @step Given the online resume is open
  await page.goto('/resume.html');
  const controls = page.getByRole('navigation', { name: 'Resume detail controls' });
  const disclosures = page.locator('.resume-page details.resume-detail');
  await expect(disclosures).toHaveCount(9);
  await expect(page.locator('.resume-page details.resume-detail[open]')).toHaveCount(0);

  // @step When the reader selects Expand all
  await controls.getByRole('button', { name: 'Expand all' }).click();
  // @step Then every role and skills detail section is open
  await expect(page.locator('.resume-page details.resume-detail[open]')).toHaveCount(9);
  // @step And the page confirms that the details are expanded
  await expect(controls).toContainText('All 9 detail sections expanded.');

  // @step When the reader selects Collapse all
  await controls.getByRole('button', { name: 'Collapse all' }).click();
  // @step Then every role and skills detail section is closed
  await expect(page.locator('.resume-page details.resume-detail[open]')).toHaveCount(0);
  // @step And the page confirms that the details are collapsed
  await expect(controls).toContainText('All 9 detail sections collapsed.');
});
