import { test, expect } from '@playwright/test';

// Feature: spec/features/protect-contact-form-with-cloudflare-turnstile.feature
test('contact page renders Turnstile and blocks submission without a challenge response', async ({ page }) => {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js', route => route.fulfill({ status: 200, body: '' }));
  // @step Given the visitor has not completed the bot check or its verification has expired
  await page.goto('/contact/');

  const challenge = page.locator('.cf-turnstile');
  await expect(page.locator('#contact-form')).toBeVisible();
  await expect(page.locator('.contact-challenge')).toBeAttached();
  await expect(challenge).toHaveCount(1);
  await expect(challenge).toHaveAttribute('data-sitekey', '1x00000000000000000000AA');
  await expect(page.locator('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')).toHaveCount(1);

  // @step When the visitor submits valid contact details and a message
  await page.locator('#contact-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  // @step Then the visitor is asked to complete the bot check and the message is not sent
  await expect(page.locator('#contact-status')).toHaveText('Please complete the bot check before sending.');
});
