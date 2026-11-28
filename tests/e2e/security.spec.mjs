import { test, expect } from '@playwright/test';

// Feature: spec/features/portfolio-security-hardening.feature
test('static pages load with the security policy and same-origin behavior remains usable', async ({ page, request }) => {
  const violations = [];
  page.on('console', message => {
    if (message.text().includes('violates the following Content Security Policy')) violations.push(message.text());
  });
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js', route => route.fulfill({ status: 200, body: '' }));

  // @step Given the portfolio has been built for Cloudflare Pages
  // @step When the visitor opens the home, contact, and resume pages
  for (const route of ['/', '/contact/', '/resume.html']) {
    const response = await request.get(route);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-security-policy']).toContain("default-src 'self'");
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.headers()['x-frame-options']).toBe('DENY');
    expect(response.headers()['strict-transport-security']).toBe('max-age=31536000');
    await page.goto(route);
  }

  // @step Then each static response includes the content security policy and baseline browser security headers
  await expect(page.locator('link[rel="stylesheet"][href="/site.css"]')).toHaveCount(1);
  // @step And contact and resume behavior loads from same-origin JavaScript without inline scripts
  await page.route('**/api/contact', route => route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ message: 'Contact delivery is not configured in the local preview.' })
  }));
  await page.goto('/contact/');
  await page.locator('#name').fill('Alex Example');
  await page.locator('#email').fill('alex@example.com');
  await page.locator('#subject').fill('Security test');
  await page.locator('#message').fill('Confirm the local contact handler loads under CSP.');
  await page.locator('#contact-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await expect(page.locator('#contact-status')).not.toBeEmpty();

  await page.goto('/resume.html');
  await page.getByRole('button', { name: 'Expand all' }).click();
  await expect(page.locator('.resume-page details.resume-detail[open]').first()).toBeVisible();
  await page.getByRole('button', { name: 'Collapse all' }).click();
  await expect(page.locator('.resume-page details.resume-detail[open]')).toHaveCount(0);
  expect(violations).toEqual([]);
});
