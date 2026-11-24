const json = (body, status = 200) => Response.json(body, {
  status,
  headers: { 'cache-control': 'no-store' }
});

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ message: 'Request could not be accepted.' }, 403);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 12_000) return json({ message: 'Message is too large.' }, 413);

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
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

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: replyTo,
      subject: `Portfolio message: ${subject}`,
      text: `From: ${name}\nReply address: ${replyTo}\n\n${message}`
    })
  });

  if (!response.ok) return json({ message: 'The message could not be sent right now. Please try LinkedIn.' }, 502);
  return json({ message: 'Thanks. Your message has been sent.' });
}
