const form = document.querySelector('#contact-form');
const status = document.querySelector('#contact-status');

form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (form.dataset.turnstileEnabled === 'true' && !form.querySelector('[name="cf-turnstile-response"]')?.value) {
    status.textContent = 'Please complete the bot check before sending.';
    return;
  }

  status.textContent = 'Sending…';
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { accept: 'application/json' }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Message could not be sent.');
    form.reset();
    status.textContent = 'Thanks. Your message has been sent.';
  } catch (error) {
    status.textContent = error.message || 'Message could not be sent. Please try LinkedIn.';
  } finally {
    button.disabled = false;
  }
});
