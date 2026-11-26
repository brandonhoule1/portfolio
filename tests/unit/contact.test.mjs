import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../../functions/api/contact.js';

// Feature: spec/features/restructure-portfolio-pages-and-correct-the-public-resume.feature
const configured = {
  GMAIL_OAUTH_CLIENT_ID: 'oauth-client-id',
  GMAIL_OAUTH_CLIENT_SECRET: 'oauth-client-secret',
  GMAIL_OAUTH_REFRESH_TOKEN: 'oauth-refresh-token',
  CONTACT_TO: 'brandonhoule@gmail.com'
};

function contactRequest(values = {}) {
  const body = new URLSearchParams({
    name: 'Alex Example',
    email: 'alex@example.com',
    subject: 'A portfolio question',
    message: 'I would like to discuss AI enablement.',
    company: '',
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
    if (String(url) === 'https://oauth2.googleapis.com/token') {
      return Response.json({ access_token: 'short-lived-access-token', expires_in: 3600 });
    }
    return Response.json({ id: 'gmail-message-id', threadId: 'gmail-thread-id' });
  };

  try {
    // @step Given the Google OAuth client, refresh token, and private recipient are configured as encrypted Cloudflare values
    const env = { ...configured };
    // @step When a visitor submits a valid contact message
    const subject = 'Résumé – architecture question '.repeat(3).trim();
    const response = await onRequestPost({ request: contactRequest({ subject }), env });
    const result = await response.json();
    // @step Then the site sends the message through Gmail API and shows a success confirmation
    assert.equal(response.status, 200);
    assert.equal(result.message, 'Thanks. Your message has been sent.');
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, 'https://oauth2.googleapis.com/token');
    assert.equal(calls[1].url, 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send');
    assert.equal(calls[1].init.headers.authorization, 'Bearer short-lived-access-token');
    const sent = JSON.parse(calls[1].init.body);
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
    assert.doesNotMatch(result.message, /oauth|gmail-message-id|brandonhoule@gmail\.com/i);
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
