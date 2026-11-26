const json = (body, status = 200) => Response.json(body, {
  status,
  headers: { 'cache-control': 'no-store' }
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function encodeBase64Url(value) {
  return encodeBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function encodeSubject(value) {
  const parts = [];
  let part = '';
  for (const character of Array.from(value)) {
    if (part && new TextEncoder().encode(part + character).length > 42) {
      parts.push(part);
      part = '';
    }
    part += character;
  }
  if (part) parts.push(part);
  return parts.map(value => `=?UTF-8?B?${encodeBase64(value)}?=`).join('\r\n ');
}

function wrapBase64(value) {
  return value.match(/.{1,76}/g)?.join('\r\n') || '';
}

function gmailMessage({ recipient, replyTo, subject, name, message }) {
  const encodedSubject = encodeSubject(`Portfolio message: ${subject}`);
  const body = `From: ${name}\nReply address: ${replyTo}\n\n${message}`;
  return [
    `To: ${recipient}`,
    `Subject: ${encodedSubject}`,
    `Reply-To: ${replyTo}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(encodeBase64(body))
  ].join('\r\n');
}

const providerFailure = () => json({ message: 'The message could not be sent right now. Please try LinkedIn.' }, 502);

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ message: 'Request could not be accepted.' }, 403);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 12_000) return json({ message: 'Message is too large.' }, 413);

  const oauthClientId = String(env.GMAIL_OAUTH_CLIENT_ID || '').trim();
  const oauthClientSecret = String(env.GMAIL_OAUTH_CLIENT_SECRET || '').trim();
  const oauthRefreshToken = String(env.GMAIL_OAUTH_REFRESH_TOKEN || '').trim();
  const recipient = String(env.CONTACT_TO || '').trim();
  if (!oauthClientId || !oauthClientSecret || !oauthRefreshToken || !emailPattern.test(recipient)) {
    return json({ message: 'Contact delivery is not configured yet. Please use LinkedIn for now.' }, 503);
  }

  let form;
  try {
    form = await request.formData();
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

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: oauthClientId,
        client_secret: oauthClientSecret,
        refresh_token: oauthRefreshToken,
        grant_type: 'refresh_token'
      })
    });
    if (!tokenResponse.ok) return providerFailure();
    const token = await tokenResponse.json();
    if (typeof token.access_token !== 'string' || !token.access_token) return providerFailure();

    const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token.access_token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        raw: encodeBase64Url(gmailMessage({ recipient, replyTo, subject, name, message }))
      })
    });
    if (!gmailResponse.ok) return providerFailure();
    return json({ message: 'Thanks. Your message has been sent.' });
  } catch {
    return providerFailure();
  }
}
