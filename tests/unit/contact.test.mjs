import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../../functions/api/contact.js';

// Feature: spec/features/restructure-portfolio-pages-and-correct-the-public-resume.feature
const configured = {
  GMAIL_OAUTH_CLIENT_ID: 'oauth-client-id',
  GMAIL_OAUTH_CLIENT_SECRET: 'oauth-client-secret',
  GMAIL_OAUTH_REFRESH_TOKEN: 'oauth-refresh-token',
  CONTACT_TO: 'brandonhoule@gmail.com',
  TURNSTILE_SECRET_KEY: 'turnstile-secret'
};

function contactRequest(values = {}) {
  const body = new URLSearchParams({
    name: 'Alex Example',
    email: 'alex@example.com',
    subject: 'A portfolio question',
    message: 'I would like to discuss AI enablement.',
    company: '',
    'cf-turnstile-response': 'valid-turnstile-token',
    ...values
  });
  return new Request('https://brandonhoule.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body
  });
}

test('valid contact message is sent through Gmail API', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    if (String(url) === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
      return Response.json({ success: true, hostname: 'brandonhoule.com' });
    }
    if (String(url) === 'https://oauth2.googleapis.com/token') {
      return Response.json({ access_token: 'short-lived-access-token', expires_in: 3600 });
    }
    return Response.json({ id: 'gmail-message-id', threadId: 'gmail-thread-id' });
  };

  try {
    // @step Given the Google OAuth client, refresh token, and private recipient are configured as encrypted Cloudflare values
    const env = { ...configured };
    // @step Given The contact form is available and a visitor has completed the bot check
    // @step When the visitor submits valid contact details and a message
    const subject = 'Résumé – architecture question '.repeat(3).trim();
    const response = await onRequestPost({ request: contactRequest({ subject }), env });
    const result = await response.json();
    // @step Then the message is sent and the visitor sees a confirmation
    assert.equal(response.status, 200);
    assert.equal(result.message, 'Thanks. Your message has been sent.');
    assert.equal(calls.length, 3);
    assert.equal(calls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.deepEqual(JSON.parse(calls[0].init.body), { secret: 'turnstile-secret', response: 'valid-turnstile-token' });
    assert.equal(calls[1].url, 'https://oauth2.googleapis.com/token');
    assert.equal(calls[2].url, 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send');
    assert.equal(calls[2].init.headers.authorization, 'Bearer short-lived-access-token');
    const sent = JSON.parse(calls[2].init.body);
    const mime = Buffer.from(sent.raw, 'base64url').toString('utf8');
    // @step And the visitor's address is the reply address while OAuth credentials and the recipient remain server-side
    assert.match(mime, /To: brandonhoule@gmail\.com/i);
    assert.match(mime, /Reply-To: alex@example\.com/i);
    const headers = mime.split(/\r?\n\r?\n/, 1)[0].replace(/\r?\n[ \t]/g, ' ');
    const subjectHeader = headers.match(/^Subject: (.*)$/m)?.[1];
    const encodedWords = [...subjectHeader.matchAll(/=\?UTF-8\?B\?([^?]+)\?=/g)].map((word) => Buffer.from(word[1], 'base64').toString('utf8'));
    assert.equal(encodedWords.join(''), `Portfolio message: ${subject}`);
    const encodedBody = mime.split(/\r?\n\r?\n/).at(-1);
    assert.match(Buffer.from(encodedBody, 'base64').toString('utf8'), /I would like to discuss AI enablement\./);
    assert.ok(encodedBody.split(/\r?\n/).every((line) => line.length <= 76));
    assert.doesNotMatch(result.message, /oauth|gmail-message-id|brandonhoule@gmail\.com|turnstile-secret/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('missing or invalid Turnstile verification blocks Gmail delivery', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    return Response.json({ success: false, hostname: 'brandonhoule.com', 'error-codes': ['invalid-input-response'] });
  };

  try {
    // @step Given the visitor has not completed the bot check or its verification has expired
    // @step When the visitor submits valid contact details and a message
    const missing = await onRequestPost({ request: contactRequest({ 'cf-turnstile-response': '' }), env: { ...configured } });
    assert.equal(missing.status, 400);
    assert.equal(calls.length, 0);

    const invalid = await onRequestPost({ request: contactRequest(), env: { ...configured } });
    assert.equal(invalid.status, 400);
    // @step Then the visitor is asked to complete the bot check and the message is not sent
    assert.equal((await invalid.json()).message, 'Please complete the bot check and try again.');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Turnstile hostname mismatch blocks Gmail delivery', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => {
    callCount += 1;
    return Response.json({ success: true, hostname: 'houlebportfolio.pages.dev' });
  };

  try {
    // @step Given the visitor has not completed the bot check or its verification has expired
    // @step When the visitor submits valid contact details and a message
    const response = await onRequestPost({ request: contactRequest(), env: { ...configured } });
    // @step Then the visitor is asked to complete the bot check and the message is not sent
    assert.equal(response.status, 400);
    assert.equal((await response.json()).message, 'Please complete the bot check and try again.');
    assert.equal(callCount, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('honeypot submission returns generic confirmation without provider delivery', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => { callCount += 1; throw new Error('Unexpected provider call'); };

  try {
    // @step Given an automated submission has filled the hidden decoy field
    // @step When the submission reaches the contact form
    const response = await onRequestPost({ request: contactRequest({ company: 'A bot filled this' }), env: { ...configured } });
    const result = await response.json();
    // @step Then the submission sees a generic confirmation and no email is sent
    assert.equal(response.status, 200);
    assert.equal(result.message, 'Thanks. Your message has been sent.');
    assert.equal(callCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('missing Turnstile secret fails closed before provider requests', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => { callCount += 1; throw new Error('Unexpected provider call'); };

  try {
    const response = await onRequestPost({ request: contactRequest(), env: { ...configured, TURNSTILE_SECRET_KEY: '' } });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).message, 'Contact verification is not configured yet. Please use LinkedIn for now.');
    assert.equal(callCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('contact delivery fails safely when Google configuration is absent', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => { callCount += 1; throw new Error('Unexpected provider call'); };

  try {
    // @step Given one or more Google OAuth or recipient values are missing
    const env = { ...configured, GMAIL_OAUTH_REFRESH_TOKEN: '' };
    // @step When a visitor submits a valid contact message
    const response = await onRequestPost({ request: contactRequest(), env });
    const result = await response.json();
    // @step Then the site shows a generic delivery configuration message and does not claim the message was sent
    assert.equal(response.status, 503);
    assert.equal(result.message, 'Contact delivery is not configured yet. Please use LinkedIn for now.');
    assert.equal(callCount, 0);
    assert.doesNotMatch(JSON.stringify(result), /oauth-client-secret|oauth-refresh-token|brandonhoule@gmail\.com/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
