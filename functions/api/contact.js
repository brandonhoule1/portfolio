import { sendContactEmail } from '../lib/gmail.js';

const MAX_REQUEST_BYTES = 12_000;
const API_SECURITY_HEADERS = {
  'cache-control': 'no-store',
  'content-security-policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
  'strict-transport-security': 'max-age=31536000',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
};

const json = (body, status = 200) => Response.json(body, {
  status,
  headers: API_SECURITY_HEADERS
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerFailure = () => json({ message: 'The message could not be sent right now. Please try LinkedIn.' }, 502);
const verificationFailure = () => json({ message: 'Please complete the bot check and try again.' }, 400);

async function readBoundedBody(request) {
  const contentLength = request.headers.get('content-length');
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) return { status: 400 };
    if (Number(contentLength) > MAX_REQUEST_BYTES) return { status: 413 };
  }

  if (!request.body) return { bytes: new Uint8Array() };
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) {
        try { await reader.cancel(); } catch {}
        return { status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { status: 400 };
  } finally {
    try { reader.releaseLock(); } catch {}
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { bytes };
}

async function verifyTurnstile(token, secret, hostname) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret, response: token })
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result?.success === true && result.hostname === hostname;
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  let requestOrigin;
  try {
    requestOrigin = new URL(request.url).origin;
    if (!origin || new URL(origin).origin !== requestOrigin) {
      return json({ message: 'Request could not be accepted.' }, 403);
    }
  } catch {
    return json({ message: 'Request could not be accepted.' }, 403);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!/^multipart\/form-data(?:\s*;|$)/i.test(contentType)) {
    return json({ message: 'Please submit the contact form and try again.' }, 415);
  }

  const bounded = await readBoundedBody(request);
  if (bounded.status === 413) return json({ message: 'Message is too large.' }, 413);
  if (bounded.status) return json({ message: 'Please submit the form fields and try again.' }, bounded.status);

  const oauthClientId = String(env.GMAIL_OAUTH_CLIENT_ID || '').trim();
  const oauthClientSecret = String(env.GMAIL_OAUTH_CLIENT_SECRET || '').trim();
  const oauthRefreshToken = String(env.GMAIL_OAUTH_REFRESH_TOKEN || '').trim();
  const recipient = String(env.CONTACT_TO || '').trim();
  const turnstileSecretKey = String(env.TURNSTILE_SECRET_KEY || '').trim();
  if (!oauthClientId || !oauthClientSecret || !oauthRefreshToken || !emailPattern.test(recipient)) {
    return json({ message: 'Contact delivery is not configured yet. Please use LinkedIn for now.' }, 503);
  }
  if (!turnstileSecretKey) {
    return json({ message: 'Contact verification is not configured yet. Please use LinkedIn for now.' }, 503);
  }

  let form;
  try {
    form = await new Response(bounded.bytes, { headers: { 'content-type': contentType } }).formData();
  } catch {
    return json({ message: 'Please submit the form fields and try again.' }, 400);
  }

  if (String(form.get('company') || '').trim()) return json({ message: 'Thanks. Your message has been sent.' });

  const name = String(form.get('name') || '').trim();
  const replyTo = String(form.get('email') || '').trim();
  const subject = String(form.get('subject') || '').trim().replace(/[\r\n]+/g, ' ');
  const message = String(form.get('message') || '').trim();
  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo) || replyTo.length > 254 || !subject || subject.length > 120 || !message || message.length > 5000) {
    return json({ message: 'Check the required fields and try again.' }, 400);
  }

  const turnstileToken = String(form.get('cf-turnstile-response') || '').trim();
  if (!turnstileToken || turnstileToken.length > 2048) return verificationFailure();

  try {
    const hostname = new URL(request.url).hostname;
    if (!await verifyTurnstile(turnstileToken, turnstileSecretKey, hostname)) return verificationFailure();
  } catch {
    return json({ message: 'We could not verify the request. Please try again.' }, 503);
  }

  try {
    const sent = await sendContactEmail({
      env,
      recipient,
      replyTo,
      subject,
      name,
      message
    });
    if (!sent) return providerFailure();
    return json({ message: 'Thanks. Your message has been sent.' });
  } catch {
    return providerFailure();
  }
}
