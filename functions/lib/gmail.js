function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

export function encodeBase64Url(value) {
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

export function gmailMessage({ recipient, replyTo, subject, name, message }) {
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

export async function sendContactEmail({ env, recipient, replyTo, subject, name, message, fetchImpl = fetch }) {
  const tokenResponse = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: String(env.GMAIL_OAUTH_CLIENT_ID || '').trim(),
      client_secret: String(env.GMAIL_OAUTH_CLIENT_SECRET || '').trim(),
      refresh_token: String(env.GMAIL_OAUTH_REFRESH_TOKEN || '').trim(),
      grant_type: 'refresh_token'
    })
  });
  if (!tokenResponse.ok) return false;
  const token = await tokenResponse.json();
  if (typeof token.access_token !== 'string' || !token.access_token) return false;

  const gmailResponse = await fetchImpl('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token.access_token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodeBase64Url(gmailMessage({ recipient, replyTo, subject, name, message }))
    })
  });
  return gmailResponse.ok;
}
