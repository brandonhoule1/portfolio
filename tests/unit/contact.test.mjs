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

function contactRequest(values = {}, options = {}) {
  const body = new FormData();
  const fields = {
    name: 'Alex Example',
    email: 'alex@example.com',
    subject: 'A portfolio question',
    message: 'I would like to discuss AI enablement.',
    company: '',
    'cf-turnstile-response': 'valid-turnstile-token',
    ...values
  };
  for (const [name, value] of Object.entries(fields)) body.set(name, value);
  const headers = new Headers();
  if (options.origin !== null) headers.set('origin', options.origin ?? 'https://brandonhoule.com');
  if (options.contentType) headers.set('content-type', options.contentType);
  if (options.contentLength) headers.set('content-length', options.contentLength);
  for (const [name, value] of Object.entries(options.headers ?? {})) headers.set(name, value);
  return new Request('https://brandonhoule.com/api/contact', {
    method: 'POST',
    headers,
    body
  });
}

function assertSecurityHeaders(response) {
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000');
  assert.match(response.headers.get('content-security-policy') ?? '', /default-src 'none'/);
  assert.match(response.headers.get('permissions-policy') ?? '', /camera=\(\)/);
}

function multipartRequest(fields, boundary = 'portfolio-security-boundary') {
  const body = Object.entries(fields).map(([name, value]) =>
    `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
  ).join('') + `--${boundary}--\r\n`;
  return { boundary, body };
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
    // @step Given the contact function returns a success, rejection, honeypot, or configuration response
    // @step When the visitor receives the response
    const subject = 'Résumé – architecture question '.repeat(3).trim();
    const response = await onRequestPost({ request: contactRequest({ subject }), env });
    const result = await response.json();
    // @step Then the message is sent and the visitor sees a confirmation
    assert.equal(response.status, 200);
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(response);
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
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(missing);
    assert.equal(calls.length, 0);

    const invalid = await onRequestPost({ request: contactRequest(), env: { ...configured } });
    assert.equal(invalid.status, 400);
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(invalid);
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
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(response);
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
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(response);
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
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(response);
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
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(response);
    assert.equal(result.message, 'Contact delivery is not configured yet. Please use LinkedIn for now.');
    assert.equal(callCount, 0);
    assert.doesNotMatch(JSON.stringify(result), /oauth-client-secret|oauth-refresh-token|brandonhoule@gmail\.com/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('missing, malformed, and cross-origin requests fail before provider calls', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => { callCount += 1; throw new Error('Unexpected provider call'); };

  try {
    // @step Given contact delivery and Turnstile are configured
    // @step When a request has no same-origin Origin, uses another origin or media type, or exceeds the request body limit
    for (const request of [
      contactRequest({}, { origin: null }),
      contactRequest({}, { origin: 'not an origin' }),
      contactRequest({}, { origin: 'https://attacker.example' })
    ]) {
      const response = await onRequestPost({ request, env: { ...configured } });
      assert.equal(response.status, 403);
      // @step Then the request is rejected before Turnstile, Google OAuth, or Gmail is contacted
      assertSecurityHeaders(response);
    }
    assert.equal(callCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('non-multipart submissions fail before provider calls', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => { callCount += 1; throw new Error('Unexpected provider call'); };

  try {
    // @step Given contact delivery and Turnstile are configured
    // @step When a request has no same-origin Origin, uses another origin or media type, or exceeds the request body limit
    const response = await onRequestPost({
      request: contactRequest({}, { contentType: 'application/json' }),
      env: { ...configured }
    });
    assert.equal(response.status, 415);
    // @step Then the request is rejected before Turnstile, Google OAuth, or Gmail is contacted
    assertSecurityHeaders(response);
    assert.equal(callCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('streamed body over 12,000 bytes is rejected without Content-Length', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => { callCount += 1; throw new Error('Unexpected provider call'); };
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(12_001));
      controller.close();
    }
  });
  const request = new Request('https://brandonhoule.com/api/contact', {
    method: 'POST',
    headers: {
      origin: 'https://brandonhoule.com',
      'content-type': 'multipart/form-data; boundary=portfolio-security-boundary'
    },
    body,
    duplex: 'half'
  });

  try {
    // @step Given contact delivery and Turnstile are configured
    // @step When a request has no same-origin Origin, uses another origin or media type, or exceeds the request body limit
    assert.equal(request.headers.has('content-length'), false);
    const response = await onRequestPost({ request, env: { ...configured } });
    assert.equal(response.status, 413);
    // @step Then the request is rejected before Turnstile, Google OAuth, or Gmail is contacted
    assertSecurityHeaders(response);
    assert.equal(callCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('valid multipart request at the 12,000-byte limit is accepted', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url) === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
      return Response.json({ success: true, hostname: 'brandonhoule.com' });
    }
    if (String(url) === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'short-lived-access-token' });
    return Response.json({ id: 'gmail-message-id' });
  };
  const fields = {
    name: 'Alex Example',
    email: 'alex@example.com',
    subject: 'A portfolio question',
    message: 'A useful note.',
    company: '',
    'cf-turnstile-response': 'valid-turnstile-token',
    padding: ''
  };
  const base = multipartRequest(fields);
  fields.padding = 'x'.repeat(12_000 - Buffer.byteLength(base.body));
  const { boundary, body } = multipartRequest(fields, base.boundary);
  const request = new Request('https://brandonhoule.com/api/contact', {
    method: 'POST',
    headers: {
      origin: 'https://brandonhoule.com',
      'content-type': `multipart/form-data; boundary=${boundary}`
    },
    body
  });

  try {
    // @step Given a visitor submits a valid same-origin multipart message with a completed Turnstile check
    // @step When the request body is exactly 12,000 bytes
    assert.equal(Buffer.byteLength(body), 12_000);
    const response = await onRequestPost({ request, env: { ...configured } });
    // @step Then the message is delivered through Gmail and the visitor receives a safe confirmation
    assert.equal(response.status, 200);
    assertSecurityHeaders(response);
    assert.equal(calls.length, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('provider failure keeps the response generic and secured', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url) === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
      return Response.json({ success: true, hostname: 'brandonhoule.com' });
    }
    return new Response('private provider diagnostic', { status: 500 });
  };

  try {
    // @step Given the contact function returns a success, rejection, honeypot, or configuration response
    // @step When the visitor receives the response
    const response = await onRequestPost({ request: contactRequest(), env: { ...configured } });
    assert.equal(response.status, 502);
    // @step Then it includes no-store and API security headers without exposing private provider details
    assertSecurityHeaders(response);
    const result = await response.text();
    assert.match(result, /Please try LinkedIn/);
    assert.doesNotMatch(result, /private provider diagnostic|oauth-client-secret|oauth-refresh-token/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
